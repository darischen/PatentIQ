import psycopg2
from openai import OpenAI
from tqdm import tqdm

# -------- CONFIG --------
client = OpenAI()
MODEL = "text-embedding-3-small"
BATCH_SIZE = 100
# ------------------------

client = OpenAI()

conn = psycopg2.connect(
    dbname="patents",
    user="natashasaini",
    host="localhost"
)

cur = conn.cursor()

cur.execute("""
SELECT p.application_number, p.title, p.abstract
FROM patents p
LEFT JOIN patent_embeddings e
ON p.application_number = e.application_number
WHERE e.application_number IS NULL

""")

rows = cur.fetchall()

print(f"Found {len(rows)} patents to embed")

def embed_texts(texts):
    response = client.embeddings.create(
        model=MODEL,
        input=texts
    )
    return [r.embedding for r in response.data]

for i in tqdm(range(0, len(rows), BATCH_SIZE)):
    batch = rows[i:i+BATCH_SIZE]

    ids = [r[0] for r in batch]
    texts = [(r[1] or "") + " " + (r[2] or "") for r in batch]

    embeddings = embed_texts(texts)

    for app_id, vector in zip(ids, embeddings):
        cur.execute(
            "INSERT INTO patent_embeddings (application_number, embedding) VALUES (%s, %s)",
            (app_id, vector)
        )

    conn.commit()

cur.close()
conn.close()

print("Done.")
