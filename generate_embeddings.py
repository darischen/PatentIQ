import os
from dotenv import load_dotenv
from openai import OpenAI
import psycopg2
from pgvector.psycopg2 import register_vector

load_dotenv()
client = OpenAI()

conn = psycopg2.connect(
    dbname="patents",
    user="natashasaini",
    host="localhost"
)

register_vector(conn)
cur = conn.cursor()

cur.execute("""
    SELECT application_number, normalized_text
    FROM patents
    WHERE embedding IS NULL;
""")

rows = cur.fetchall()
print(f"Found {len(rows)} rows to embed...")


for application_number, text in rows:
    try:
        MAX_CHARS = 12000

        if len(text) > MAX_CHARS:
            text = text[:MAX_CHARS]

        embedding = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        ).data[0].embedding

        cur.execute("""
            UPDATE patents
            SET embedding = %s
            WHERE application_number = %s;
        """, (embedding, application_number))

        conn.commit()
        print(f"Embedded patent {application_number}")

    except Exception as e:
        print(f"Error embedding {application_number}: {e}")














       
cur.close()
conn.close()
print("Done.")
