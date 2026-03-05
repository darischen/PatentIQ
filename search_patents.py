from dotenv import load_dotenv
from openai import OpenAI
import psycopg2
from pgvector.psycopg2 import register_vector
import os

load_dotenv()

client = OpenAI()

# Connect to DB
conn = psycopg2.connect(
    dbname="patents",
    user="natashasaini",
    host="localhost"
)

register_vector(conn)
cur = conn.cursor()

query_text = input("Enter search query: ")

# Generate embedding for query
response = client.embeddings.create(
    model="text-embedding-3-small",
    input=query_text
)

query_embedding = response.data[0].embedding

# Single-table vector search
cur.execute("""
    SELECT title, abstract
    FROM patents
    ORDER BY embedding <=> %s::vector
    LIMIT 5;
""", (query_embedding,))

results = cur.fetchall()

print("\nTop Matches:\n")

for r in results:
    print("Title:", r[0])
    print("Abstract:", r[1])
    print("------")

cur.close()
conn.close()
