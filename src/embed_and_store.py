import psycopg2
from pgvector.psycopg2 import register_vector
from openai import OpenAI
from dotenv import load_dotenv
from src.parse_patents import parse_patents
from src.normalize_ideas import normalize_idea
import os

load_dotenv()
client = OpenAI()

conn = psycopg2.connect(
    dbname="patents",
    user="natashasaini",  # change if needed
    host="localhost"
)

register_vector(conn)
cur = conn.cursor()

df = parse_patents()

for _, row in df.iterrows():
    normalized = normalize_idea(row["full_text"])

    emb_res = client.embeddings.create(
        model="text-embedding-3-small",
        input=normalized
    )
    embedding = emb_res.data[0].embedding

    cur.execute("""
        INSERT INTO patents
        (title, abstract, claims, cpc, filing_date, normalized_text, embedding)
        VALUES (%s,%s,%s,%s,%s,%s,%s);
    """, (
        row["title"],
        row["abstract"],
        row["claims"],
        row["cpc"],
        row["filing_date"],
        normalized,
        embedding
    ))

conn.commit()
cur.close()
conn.close()

print("Embeddings stored successfully!")
