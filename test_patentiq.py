from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

sample_text = """
An agricultural row unit including a frame, a seed delivery system,
a trench opener configured to create a furrow in soil,
and a depth control mechanism to improve seed placement accuracy.
"""

patentiq_prompt = f"""
You are PatentIQ, an advanced AI-powered patent intelligence system.

Follow this workflow:

STEP 1: IDEA SUMMARY
STEP 2: KEY TECHNICAL COMPONENTS
STEP 3: PRIOR ART SIMILARITY ANALYSIS
STEP 4: NOVELTY & NON-OBVIOUSNESS
STEP 5: COMMERCIAL VIABILITY
STEP 6: HYBRID SCORING
STEP 7: RECOMMENDATION
STEP 8: STRATEGIC IMPROVEMENTS

Invention text:
{sample_text}
"""

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are PatentIQ."},
        {"role": "user", "content": patentiq_prompt}
    ],
    temperature=0.3
)

print(response.choices[0].message.content)
