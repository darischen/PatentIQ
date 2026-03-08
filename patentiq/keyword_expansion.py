def expand_keywords(query):
    words = query.lower().split()

    synonyms = {
        "soil": ["earth", "ground"],
        "plant": ["seed", "crop"],
        "tractor": ["farm machine"]
    }

    expanded = words.copy()

    for w in words:
        if w in synonyms:
            expanded.extend(synonyms[w])

    return list(set(expanded))
