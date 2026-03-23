def suggest_cpc(query):

    if "soil" in query.lower():
        return ["A01B", "A01C"]

    if "sensor" in query.lower():
        return ["G01D"]

    return ["Unknown"]
