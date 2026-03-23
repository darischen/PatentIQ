import re
from typing import Dict, Iterable, List, Optional, Sequence, Set, Tuple

# Generic words are too broad for overlap decisions and can create false positives.
GENERIC_TERMS: Set[str] = {
    "system",
    "method",
    "device",
    "process",
    "module",
    "apparatus",
    "unit",
    "tool",
    "feature",
    "technology",
    "application",
    "service",
    "function",
    "component",
}

STOPWORDS: Set[str] = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "in",
    "into",
    "is",
    "it",
    "of",
    "on",
    "or",
    "that",
    "the",
    "this",
    "to",
    "using",
    "with",
}

LOW_SIGNAL_SINGLE_TERMS: Set[str] = {
    "data",
    "processing",
    "sensor",
    "monitoring",
    "model",
    "network",
}

DEFAULT_SYNONYMS: Dict[str, List[str]] = {
    "predictive maintenance": ["predictive servicing", "proactive maintenance"],
    "sensor data processing": ["sensor signal processing", "processing sensor data"],
    "equipment monitoring": ["machine monitoring", "asset monitoring"],
}


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9\s]", " ", text.lower())).strip()


def _tokenize(text: str) -> List[str]:
    normalized = normalize_text(text)
    if not normalized:
        return []
    return [token for token in normalized.split(" ") if token]


def _generate_ngrams(tokens: Sequence[str], n: int) -> Iterable[str]:
    for i in range(0, max(0, len(tokens) - n + 1)):
        yield " ".join(tokens[i : i + n])


def extract_concepts(
    text: str,
    max_ngram: int = 3,
    generic_terms: Optional[Set[str]] = None,
) -> List[str]:
    generic = generic_terms or GENERIC_TERMS
    tokens = [
        t
        for t in _tokenize(text)
        if len(t) >= 3 and t not in generic and t not in STOPWORDS
    ]
    concepts: Set[str] = set(tokens)

    for size in range(2, max_ngram + 1):
        for phrase in _generate_ngrams(tokens, size):
            if phrase and phrase not in generic:
                concepts.add(phrase)

    return sorted(concepts)


def extract_structured_concepts(text: str, max_concepts: int = 20) -> Dict[str, object]:
    concepts = extract_concepts(text)
    concepts = concepts[:max_concepts]
    technical_features = [concept for concept in concepts if _token_count(concept) >= 2]
    return {
        "concepts": concepts,
        "technical_features": technical_features,
        "concept_count": len(concepts),
    }


def _build_synonym_lookup(synonyms: Optional[Dict[str, List[str]]]) -> Dict[str, str]:
    table = synonyms or DEFAULT_SYNONYMS
    lookup: Dict[str, str] = {}
    for canonical, variants in table.items():
        normalized_canonical = normalize_text(canonical)
        lookup[normalized_canonical] = normalized_canonical
        for variant in variants:
            lookup[normalize_text(variant)] = normalized_canonical
    return lookup


def _canonicalize(concept: str, synonym_lookup: Dict[str, str]) -> str:
    normalized = normalize_text(concept)
    return synonym_lookup.get(normalized, normalized)


def concept_similarity(
    concept_a: str,
    concept_b: str,
    synonym_lookup: Optional[Dict[str, str]] = None,
) -> Tuple[float, str]:
    lookup = synonym_lookup or _build_synonym_lookup(None)
    a = _canonicalize(concept_a, lookup)
    b = _canonicalize(concept_b, lookup)

    if not a or not b:
        return 0.0, "none"

    if a == b:
        return 1.0, "exact"

    tokens_a = set(a.split())
    tokens_b = set(b.split())

    if tokens_a and tokens_b:
        intersection = len(tokens_a & tokens_b)
        union = len(tokens_a | tokens_b)
        jaccard = intersection / union if union else 0.0
    else:
        jaccard = 0.0

    if a in b or b in a:
        containment_score = 0.8
    else:
        containment_score = 0.0

    score = max(jaccard, containment_score)

    if score >= 0.8:
        return score, "partial"
    if score > 0:
        return score, "related"

    return 0.0, "none"


def classify_overlap_risk(overlap_count: int, average_score: float) -> str:
    if overlap_count >= 3 and average_score >= 0.75:
        return "High"
    if overlap_count >= 1 and average_score >= 0.55:
        return "Moderate"
    return "Low"


def _token_count(text: str) -> int:
    return len(normalize_text(text).split())


def _dedupe_by_patent_concept(overlaps: List[Dict[str, object]]) -> List[Dict[str, object]]:
    deduped: List[Dict[str, object]] = []
    seen: Set[str] = set()

    for item in overlaps:
        normalized = normalize_text(str(item["patent_concept"]))
        if normalized in seen:
            continue
        seen.add(normalized)
        deduped.append(item)

    return deduped


def _prune_subsumed_concepts(overlaps: List[Dict[str, object]]) -> List[Dict[str, object]]:
    if not overlaps:
        return []

    kept: List[Dict[str, object]] = []

    for candidate in overlaps:
        candidate_text = normalize_text(str(candidate["patent_concept"]))
        candidate_tokens = set(candidate_text.split())
        candidate_size = _token_count(candidate_text)
        candidate_score = float(candidate["similarity_score"])

        subsumed = False
        for existing in overlaps:
            if existing is candidate:
                continue

            existing_text = normalize_text(str(existing["patent_concept"]))
            existing_tokens = set(existing_text.split())
            existing_size = _token_count(existing_text)
            existing_score = float(existing["similarity_score"])

            if existing_size <= candidate_size:
                continue

            if not candidate_tokens or not existing_tokens:
                continue

            # Drop shorter highlights if a longer phrase with similar confidence contains them.
            if candidate_tokens.issubset(existing_tokens) and existing_score >= candidate_score - 0.05:
                subsumed = True
                break

        if not subsumed:
            kept.append(candidate)

    return kept


def _is_low_signal_single_term(concept: str) -> bool:
    normalized = normalize_text(concept)
    return _token_count(normalized) == 1 and normalized in LOW_SIGNAL_SINGLE_TERMS


def _finalize_overlaps(overlaps: List[Dict[str, object]]) -> List[Dict[str, object]]:
    phrase_overlaps = [o for o in overlaps if _token_count(str(o["patent_concept"])) >= 2]
    if phrase_overlaps:
        filtered_phrases = [
            o for o in phrase_overlaps if not _is_low_signal_single_term(str(o["patent_concept"]))
        ]
        return filtered_phrases if filtered_phrases else phrase_overlaps

    # If only single-word candidates exist, keep only non-generic technical tokens.
    return [o for o in overlaps if not _is_low_signal_single_term(str(o["patent_concept"]))]


def _highlight_phrase(text: str, phrase: str) -> str:
    if not text or not phrase:
        return text

    pattern = re.compile(re.escape(phrase), re.IGNORECASE)
    return pattern.sub(lambda m: f"[[HIGHLIGHT]]{m.group(0)}[[/HIGHLIGHT]]", text, count=1)


def _extract_highlighted_section(text: str, phrase: str, context_chars: int = 90) -> str:
    if not text or not phrase:
        return ""

    lowered = text.lower()
    idx = lowered.find(phrase.lower())
    if idx == -1:
        return ""

    start = max(0, idx - context_chars)
    end = min(len(text), idx + len(phrase) + context_chars)
    snippet = text[start:end].strip()
    return _highlight_phrase(snippet, phrase)


def find_concept_overlaps(
    invention_text: str,
    patent_text: str,
    similarity_threshold: float = 0.65,
    synonyms: Optional[Dict[str, List[str]]] = None,
    max_highlights: int = 8,
) -> Dict[str, object]:
    synonym_lookup = _build_synonym_lookup(synonyms)

    invention_concepts = extract_concepts(invention_text)
    patent_concepts = extract_concepts(patent_text)
    structured_user = extract_structured_concepts(invention_text)
    structured_patent = extract_structured_concepts(patent_text)

    overlaps = []

    for concept_a in invention_concepts:
        best_match = None

        for concept_b in patent_concepts:
            similarity, match_type = concept_similarity(concept_a, concept_b, synonym_lookup)
            if similarity < similarity_threshold:
                continue

            candidate = {
                "invention_concept": concept_a,
                "patent_concept": concept_b,
                "similarity_score": round(similarity, 4),
                "match_type": match_type,
                "invention_section": _extract_highlighted_section(invention_text, concept_a),
                "patent_section": _extract_highlighted_section(patent_text, concept_b),
            }

            if not best_match or candidate["similarity_score"] > best_match["similarity_score"]:
                best_match = candidate

        if best_match:
            overlaps.append(best_match)

    overlaps.sort(key=lambda item: item["similarity_score"], reverse=True)
    overlaps = _dedupe_by_patent_concept(overlaps)
    overlaps = _prune_subsumed_concepts(overlaps)
    overlaps = _finalize_overlaps(overlaps)
    overlaps = overlaps[:max_highlights]

    average_score = (
        sum(item["similarity_score"] for item in overlaps) / len(overlaps) if overlaps else 0.0
    )

    highlighted_sections = [
        {
            "matched_concept": item["patent_concept"],
            "invention_section": item["invention_section"],
            "patent_section": item["patent_section"],
        }
        for item in overlaps
    ]

    return {
        "overlap_count": len(overlaps),
        "overlaps": overlaps,
        "highlight_terms": [item["patent_concept"] for item in overlaps],
        "highlighted_sections": highlighted_sections,
        "user_concepts": invention_concepts,
        "patent_concepts": patent_concepts,
        "structured_user_concepts": structured_user,
        "structured_patent_concepts": structured_patent,
        "average_similarity": round(average_score, 4),
        "risk_level": classify_overlap_risk(len(overlaps), average_score),
        "similarity_threshold": similarity_threshold,
    }
