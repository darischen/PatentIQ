def compute_hybrid_score(query, keywords, title, abstract):

    keyword_score = 0

    text = (title + " " + abstract).lower()

    for k in keywords:
        if k in text:
            keyword_score += 1

    return keyword_score
