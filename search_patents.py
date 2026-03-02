import os
import psycopg2
from openai import OpenAI

# OpenAI client (reads OPENAI_API_KEY from environment)
client = OpenAI()

MODEL = "text-embedding-3-small"

# Get user query
query_text = input("Enter search query: ")

# Generate embedding for query
response = client.embeddings.create(
    model=MODEL,
    input=query_text
)

query_embedding = response.data[0].embedding

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname="patents",
    user="natashasaini",   
    host="localhost",
    port="5432"
)

cur = conn.cursor()

# Perform vector similarity search
cur.execute(
    """
    SELECT p.application_number,
           p.title,
           p.abstract,
           e.embedding <-> %s::vector AS distance
    FROM patent_embeddings e
    JOIN patents p
      ON p.application_number = e.application_number
    ORDER BY e.embedding <-> %s::vector
    LIMIT 5;
    """,
    (query_embedding, query_embedding)
)

results = cur.fetchall()

print("\nTop 5 Results:\n")

for row in results:
    print("Application:", row[0])
    print("Title:", row[1])
    print("Distance:", row[3])
    print("-" * 50)

cur.close()
conn.close()

