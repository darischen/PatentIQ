/**
 * Patent Concept Overlap Detection
 * TypeScript port of overlap_highlighting.py (by Bipin Nepal)
 * Ported from Python to TypeScript for Vercel serverless compatibility
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const GENERIC_TERMS = new Set([
  'system',
  'method',
  'device',
  'process',
  'module',
  'apparatus',
  'unit',
  'tool',
  'feature',
  'technology',
  'application',
  'service',
  'function',
  'component',
]);

const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
]);

const LOW_SIGNAL_SINGLE_TERMS = new Set([
  'data',
  'processing',
  'sensor',
  'monitoring',
  'model',
  'network',
]);

const DEFAULT_SYNONYMS: Record<string, string[]> = {
  'predictive maintenance': ['predictive servicing', 'proactive maintenance'],
  'machine learning': ['ml', 'deep learning'],
  'artificial intelligence': ['ai'],
  'internet of things': ['iot'],
};

// ============================================================================
// TYPES
// ============================================================================

export interface OverlapEntry {
  invention_concept: string;
  patent_concept: string;
  similarity_score: number;
  match_type: string;
  invention_section: string;
  patent_section: string;
}

export interface OverlapResult {
  overlap_count: number;
  overlaps: OverlapEntry[];
  highlight_terms: string[];
  average_similarity: number;
  risk_level: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(' ')
    .filter((t) => t.length > 0);
}

function generateNgrams(tokens: string[], n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

function extractConcepts(text: string, maxNgram: number = 3): string[] {
  const tokens = tokenize(text).filter(
    (t) => t.length > 2 && !STOPWORDS.has(t) && !GENERIC_TERMS.has(t)
  );

  const concepts = new Set<string>();

  // Add unigrams
  tokens.forEach((token) => {
    concepts.add(token);
  });

  // Add n-grams
  for (let n = 2; n <= maxNgram && n <= tokens.length; n++) {
    const ngrams = generateNgrams(tokens, n);
    ngrams.forEach((ngram) => {
      // Check if any token in the n-gram is in GENERIC_TERMS
      const ngramTokens = ngram.split(' ');
      if (!ngramTokens.some((t) => GENERIC_TERMS.has(t))) {
        concepts.add(ngram);
      }
    });
  }

  return Array.from(concepts).sort();
}

function extractStructuredConcepts(
  text: string,
  maxConcepts: number = 20
): {
  concepts: string[];
  technical_features: string[];
  concept_count: number;
} {
  const concepts = extractConcepts(text).slice(0, maxConcepts);
  const technical_features = concepts.filter((c) => tokenCount(c) >= 2);

  return {
    concepts,
    technical_features,
    concept_count: concepts.length,
  };
}

function buildSynonymLookup(
  synonyms: Record<string, string[]>
): Record<string, string> {
  const lookup: Record<string, string> = {};

  for (const [canonical, variants] of Object.entries(synonyms)) {
    const normalizedCanonical = normalizeText(canonical);
    lookup[normalizedCanonical] = normalizedCanonical;

    variants.forEach((variant) => {
      lookup[normalizeText(variant)] = normalizedCanonical;
    });
  }

  return lookup;
}

function canonicalize(
  concept: string,
  synonymLookup: Record<string, string>
): string {
  const normalized = normalizeText(concept);
  return synonymLookup[normalized] || normalized;
}

function conceptSimilarity(
  conceptA: string,
  conceptB: string,
  synonymLookup: Record<string, string>
): [number, string] {
  const canA = canonicalize(conceptA, synonymLookup);
  const canB = canonicalize(conceptB, synonymLookup);

  // Exact match
  if (canA === canB) {
    return [1.0, 'exact'];
  }

  // Jaccard similarity
  const tokensA = new Set(canA.split(' '));
  const tokensB = new Set(canB.split(' '));

  const intersection = new Set([...tokensA].filter((x) => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);

  const jaccardScore =
    union.size > 0 ? intersection.size / union.size : 0;

  // Containment check
  let containmentScore = 0;
  if (canA.includes(canB) || canB.includes(canA)) {
    containmentScore = 0.8;
  }

  const score = Math.max(jaccardScore, containmentScore);

  if (score >= 0.8) {
    return [score, 'partial'];
  } else if (score > 0) {
    return [score, 'related'];
  } else {
    return [0.0, 'none'];
  }
}

function classifyOverlapRisk(
  overlapCount: number,
  averageScore: number
): string {
  if (overlapCount >= 3 && averageScore >= 0.75) {
    return 'High';
  }
  if (overlapCount >= 1 && averageScore >= 0.55) {
    return 'Moderate';
  }
  return 'Low';
}

function tokenCount(text: string): number {
  return normalizeText(text).split(' ').length;
}

function dedupeByPatentConcept(
  overlaps: OverlapEntry[]
): OverlapEntry[] {
  const seen = new Set<string>();
  return overlaps.filter((o) => {
    const normalized = normalizeText(o.patent_concept);
    if (seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}

function pruneSubsumedConcepts(
  overlaps: OverlapEntry[]
): OverlapEntry[] {
  return overlaps.filter((candidate) => {
    const candidateTokens = new Set(candidate.patent_concept.split(' '));

    for (const other of overlaps) {
      if (candidate === other) continue;

      const otherTokens = new Set(other.patent_concept.split(' '));

      // Check if candidate's tokens are a subset of other's
      const isSubset = [...candidateTokens].every((t) => otherTokens.has(t));

      // Check if scores are within 0.05
      const scoresClose =
        Math.abs(candidate.similarity_score - other.similarity_score) <= 0.05;

      if (isSubset && scoresClose && otherTokens.size > candidateTokens.size) {
        return false; // candidate is subsumed
      }
    }
    return true;
  });
}

function isLowSignalSingleTerm(concept: string): boolean {
  const parts = concept.split(' ');
  return parts.length === 1 && LOW_SIGNAL_SINGLE_TERMS.has(parts[0]);
}

function finalizeOverlaps(overlaps: OverlapEntry[]): OverlapEntry[] {
  // Check if there are any multi-word phrase overlaps
  const multiWordOverlaps = overlaps.filter((o) => tokenCount(o.patent_concept) >= 2);

  if (multiWordOverlaps.length > 0) {
    // Return multi-word overlaps, filtering out low-signal single terms
    return multiWordOverlaps.filter((o) => !isLowSignalSingleTerm(o.patent_concept));
  }

  // Fall back to single-word overlaps, removing low-signal terms
  return overlaps.filter((o) => !isLowSignalSingleTerm(o.patent_concept));
}

function highlightPhrase(text: string, phrase: string): string {
  const lowerText = text.toLowerCase();
  const lowerPhrase = phrase.toLowerCase();
  const index = lowerText.indexOf(lowerPhrase);

  if (index === -1) {
    return text;
  }

  const before = text.substring(0, index);
  const matched = text.substring(index, index + phrase.length);
  const after = text.substring(index + phrase.length);

  return `${before}[[HIGHLIGHT]]${matched}[[/HIGHLIGHT]]${after}`;
}

function extractHighlightedSection(
  text: string,
  phrase: string,
  contextChars: number = 90
): string {
  const lowerText = text.toLowerCase();
  const lowerPhrase = phrase.toLowerCase();
  const index = lowerText.indexOf(lowerPhrase);

  if (index === -1) {
    return '';
  }

  const start = Math.max(0, index - contextChars / 2);
  const end = Math.min(text.length, index + phrase.length + contextChars / 2);

  const section = text.substring(start, end);
  return highlightPhrase(section, phrase);
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export function findConceptOverlaps(
  inventionText: string,
  patentText: string,
  similarityThreshold: number = 0.65,
  synonyms: Record<string, string[]> | null = null,
  maxHighlights: number = 8
): OverlapResult {
  const syns = synonyms || DEFAULT_SYNONYMS;
  const synonymLookup = buildSynonymLookup(syns);

  // Extract concepts
  const inventionConcepts = extractConcepts(inventionText);
  const patentConcepts = extractConcepts(patentText);

  const inventionStructured = extractStructuredConcepts(inventionText);
  const patentStructured = extractStructuredConcepts(patentText);

  // Find overlaps: for each invention concept, find best matching patent concept
  const overlapMap: Record<string, OverlapEntry> = {};

  for (const invConcept of inventionConcepts) {
    let bestMatch: OverlapEntry | null = null;
    let bestScore = 0;

    for (const patConcept of patentConcepts) {
      const [score, matchType] = conceptSimilarity(
        invConcept,
        patConcept,
        synonymLookup
      );

      if (score >= similarityThreshold && score > bestScore) {
        bestScore = score;
        bestMatch = {
          invention_concept: invConcept,
          patent_concept: patConcept,
          similarity_score: score,
          match_type: matchType,
          invention_section: extractHighlightedSection(inventionText, invConcept),
          patent_section: extractHighlightedSection(patentText, patConcept),
        };
      }
    }

    if (bestMatch) {
      const key = `${bestMatch.invention_concept}|${bestMatch.patent_concept}`;
      overlapMap[key] = bestMatch;
    }
  }

  let overlaps: OverlapEntry[] = Object.values(overlapMap);

  // Post-processing pipeline
  overlaps.sort((a, b) => b.similarity_score - a.similarity_score);
  overlaps = dedupeByPatentConcept(overlaps);
  overlaps = pruneSubsumedConcepts(overlaps);
  overlaps = finalizeOverlaps(overlaps);
  overlaps = overlaps.slice(0, maxHighlights);

  // Calculate average similarity
  const averageSimilarity =
    overlaps.length > 0
      ? parseFloat(
          (
            overlaps.reduce((sum, o) => sum + o.similarity_score, 0) /
            overlaps.length
          ).toFixed(4)
        )
      : 0;

  const riskLevel = classifyOverlapRisk(overlaps.length, averageSimilarity);
  const highlightTerms = overlaps.map((o) => o.patent_concept);

  return {
    overlap_count: overlaps.length,
    overlaps,
    highlight_terms: highlightTerms,
    average_similarity: averageSimilarity,
    risk_level: riskLevel,
  };
}

// ============================================================================
// WRAPPER FUNCTION (replaces detect_overlaps.py)
// ============================================================================

export function detectConceptOverlaps(
  invention: string,
  patents: Array<{ id: string; text: string }>
): Array<
  OverlapResult & {
    patent_id: string;
  }
> {
  return patents
    .filter((p) => p.text && p.text.trim().length > 0)
    .map((patent) => {
      const result = findConceptOverlaps(invention, patent.text);
      return {
        patent_id: patent.id,
        ...result,
      };
    });
}
