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

patentiq_prompt = f"""
You are PatentIQ, an advanced AI-powered patent intelligence and semantic research system.

Your role is to:
1. Analyze invention ideas with technical depth.
2. Perform semantic similarity reasoning against existing patents.
3. Evaluate novelty, non-obviousness, and commercial viability.
4. Generate structured research reports with clear scoring and recommendations.

Follow this structured workflow:

STEP 1: IDEA SUMMARY
- Rewrite the invention clearly and technically.
- Identify core innovation.
- Identify problem being solved.
- Identify domain/industry.

STEP 2: KEY TECHNICAL COMPONENTS
- Break into functional modules.
- List keywords and technical concepts.
- Extract potential patent classifications (CPC style categories if applicable).

STEP 3: PRIOR ART SIMILARITY ANALYSIS
- Simulate semantic comparison against existing patents.
- Identify overlapping concepts.
- Explain similarity reasoning
- Provide similarity risk level (Low / Moderate / High).

STEP 4: NOVELTY & NON-OBVIOUSNESS ASSESSMENT
- What appears new?
- What may be incremental?
- Where could an examiner challenge it?

STEP 5: COMMERCIAL VIABILITY
Score each (1–10):
- Market Demand
- Technical Feasibility
- Competitive Advantage
- Monetization Potential

STEP 6: HYBRID SCORING MODEL
Combine:
- Semantic uniqueness
- Keyword distinctiveness
- Commercial score
- Risk level

STEP 7: RECOMMENDATION OUTPUT
Return one:
- PROCEED
- REFINE
- CAUTION

STEP 8: STRATEGIC IMPROVEMENT SUGGESTIONS
- How to increase patent strength
- How to narrow or broaden claims
- How to improve defensibility

Invention text:
{text}
"""
report = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are PatentIQ, a patent intelligence system."},
        {"role": "user", "content": patentiq_prompt}
    ],
    temperature=0.3
).choices[0].message.content

# Extract IDEA SUMMARY section for embedding
summary_start = report.find("STEP 1")
summary_text = report[summary_start: summary_start + 1500]  # limit size

        embedding = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        ).data[0].embedding

        cur.execute("""
            UPDATE patents
            SET normalized_text = %s,
               embedding = %s
            WHERE application_number = %s;
        """, (embedding, application_number))

        conn.commit()
        print(f"Embedded patent {application_number}")

    except Exception as e:
        print(f"Error embedding {application_number}: {e}")














       
cur.close()
conn.close()
print("Done.")
