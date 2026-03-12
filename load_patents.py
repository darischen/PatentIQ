#!/usr/bin/env python3
import os
import psycopg2
from pgvector.psycopg2 import register_vector
from openai import OpenAI
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

# Get database credentials from env or use defaults
db_host = os.getenv('DB_HOST', 'localhost')
db_port = os.getenv('DB_PORT', '5432')
db_user = os.getenv('DB_USER', 'postgres')
db_password = os.getenv('DB_PASSWORD', 'postgres')
db_name = os.getenv('DB_NAME', 'patentiq')

# Connect to database
conn = psycopg2.connect(
    host=db_host,
    port=db_port,
    user=db_user,
    password=db_password,
    database=db_name
)

register_vector(conn)
cur = conn.cursor()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Load CSV
csv_path = r"C:\Users\daris\Downloads\patents_clean.csv"
print(f"Loading patents from {csv_path}...")
df = pd.read_csv(csv_path)

print(f"Total patents in CSV: {len(df)}")

# Load just first 20 patents for testing
df = df.head(20)
print(f"Loading first {len(df)} patents into database...")

# Generate embeddings and insert
for idx, row in df.iterrows():
    try:
        title = row['title']
        abstract = row['abstract']

        # Create text for embedding
        text_to_embed = f"{title}. {abstract}"

        print(f"[{idx+1}/{len(df)}] Processing: {title[:50]}...")

        # Generate embedding
        embedding_response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text_to_embed
        )
        embedding = embedding_response.data[0].embedding

        # Insert into database
        cur.execute(
            """
            INSERT INTO patents (title, abstract, embedding)
            VALUES (%s, %s, %s)
            """,
            (title, abstract, embedding)
        )

        conn.commit()
        print(f"  [OK] Inserted successfully")

    except Exception as e:
        print(f"  [ERROR] {e}")
        conn.rollback()

cur.close()
conn.close()

print("\nDone! Patents loaded into database.")
