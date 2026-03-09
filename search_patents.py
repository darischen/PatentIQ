import psycopg2
from openai import OpenAI

from patentiq.keyword_expansion import expand_keywords
from patentiq.hybrid_scoring import compute_hybrid_score
from patentiq.cpc_classifier import suggest_cpc


# Initialize OpenAI client
client = OpenAI()


# PostgreSQL connection
conn = psycopg2.connect(
    dbname="patents",
    user="natashasaini",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()


def generate_embedding(text):
    """
    Generate embedding for search query
    """

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )

    return response.data[0].embedding


def vector_search(query_embedding, top_k=20):

    vector = "[" + ",".join(map(str, query_embedding)) + "]"

    cursor.execute(
        """
        SELECT application_number, normalized_text, embedding
        FROM patents
        ORDER BY embedding <-> %s::vector
        LIMIT %s
        """,
        (vector, top_k)
    )

    return cursor.fetchall()
    


def run_search():

    query = input("\nEnter search query: ")

    print("\nStep 1: Keyword Expansion")
    expanded_keywords = expand_keywords(query)
    print("Expanded Keywords:", expanded_keywords)


    print("\nStep 2: Generating Query Embedding")
    query_embedding = generate_embedding(query)


    print("\nStep 3: Vector Similarity Search")
    candidates = vector_search(query_embedding)


    print("\nStep 4: Hybrid Scoring")

    results = []

    for patent in candidates:

        application_number,text, embedding = patent

        score = compute_hybrid_score(
            query=query,
            keywords=expanded_keywords,
            title=text,
            abstract=text
        )

        results.append((score, application_number,text))


    results.sort(reverse=True)


    print("\nStep 5: CPC Classification Suggestion")
    cpc_codes = suggest_cpc(query)

    print("Suggested CPC Codes:", cpc_codes)


    print("\nTop Patent Matches:\n")

    for score, title, abstract in results[:5]:

        print("Application:", application_number)
        print("Patent Text:", text[:250])
        print("Score:", score)
        print("-" * 60)


if __name__ == "__main__":
    run_search()
