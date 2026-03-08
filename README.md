
<h1 align="center">🔎 Patent Semantic Search Engine</h1>

<p align="center">
AI-powered patent search using <b>semantic embeddings, PostgreSQL, and hybrid ranking</b>
</p>

<p align="center">
<img src="https://img.shields.io/badge/Python-3.9+-blue">
<img src="https://img.shields.io/badge/PostgreSQL-pgvector-green">
<img src="https://img.shields.io/badge/AI-Semantic%20Search-orange">
<img src="https://img.shields.io/badge/Docker-Enabled-blue">
</p>

<hr>

<h2>📌 Overview</h2>

<p>
This project implements a <b>semantic patent search engine</b> that retrieves patents based on meaning rather than exact keywords.
</p>

<p>
The system converts patent text and user queries into numerical vectors (embeddings) and performs similarity search using <b>PostgreSQL with pgvector</b>.
</p>

<hr>

<h2>🚀 Features</h2>

<ul>
<li>Semantic patent search using vector embeddings</li>
<li>Vector similarity search using PostgreSQL + pgvector</li>
<li>Hybrid ranking combining semantic similarity and keyword scoring</li>
<li>Patent title and abstract retrieval</li>
<li>Terminal-based interactive search</li>
<li>Keyword expansion for improved recall</li>
<li>CPC classification suggestions</li>
</ul>

<hr>

<h2>🏗 System Architecture</h2>

<pre>
                ┌─────────────────────────────┐
                │           USER              │
                │  Enter patent search query  │
                │                             │
                │ "detect air pockets in soil"│
                └──────────────┬──────────────┘
                               │
                               ▼
                ┌─────────────────────────────┐
                │       QUERY PROCESSING      │
                │                             │
                │ • Normalize text            │
                │ • Remove stopwords          │
                │ • Keyword expansion         │
                └──────────────┬──────────────┘
                               │
                               ▼
                ┌─────────────────────────────┐
                │    EMBEDDING GENERATION     │
                │                             │
                │ Text → Vector representation│
                │ Example:                    │
                │ [0.21, -0.34, 0.77 ...]     │
                └──────────────┬──────────────┘
                               │
                               ▼
                ┌─────────────────────────────┐
                │      VECTOR DATABASE        │
                │                             │
                │ PostgreSQL + pgvector       │
                │                             │
                │ Stored data:                │
                │ • Patent title              │
                │ • Patent abstract           │
                │ • Embedding vectors         │
                └──────────────┬──────────────┘
                               │
                               ▼
                ┌─────────────────────────────┐
                │    VECTOR SIMILARITY SEARCH │
                │                             │
                │ Cosine similarity ranking   │
                │ using pgvector operators    │
                └──────────────┬──────────────┘
                               │
                               ▼
                ┌─────────────────────────────┐
                │      HYBRID SCORING         │
                │                             │
                │ Final Score =               │
                │                             │
                │ 0.7 × semantic similarity   │
                │ + 0.3 × keyword match       │
                └──────────────┬──────────────┘
                               │
                               ▼
                ┌─────────────────────────────┐
                │      RANKED PATENT RESULTS  │
                │                             │
                │ Title                       │
                │ Abstract                    │
                │ Similarity score            │
                └──────────────┬──────────────┘
                               │
                               ▼
                ┌─────────────────────────────┐
                │      TERMINAL OUTPUT        │
                │                             │
                │ Top Matches Displayed       │
                │ in Terminal Interface       │
                └─────────────────────────────┘

<img width="1456" height="668" alt="Screenshot 2026-03-08 at 12 26 48 PM" src="https://github.com/user-attachments/assets/8497f7a0-0d2c-4917-81e8-f9bae1b483fc" />

</pre>
## Semantic Patent Search Demo

Example query:
detect air pockets in soil


Pipeline steps:
- Keyword expansion
- Query embedding generation
- Vector similarity search
- Hybrid ranking
- CPC classification suggestion

<hr>

<h2>📂 Project Structure</h2>

<pre>
patent-semantic-search
│
├── patentiq
│   ├── hybrid_scoring.py
│   ├── keyword_expansion.py
│   └── cpc_classifier.py
│
├── search_patents.py
├── test_patentiq.py
├── docker-compose.yml
└── README.md
</pre>

<hr>

<h2>⚙️ Installation</h2>

<pre>
git clone https://github.com/NATASHASAINI/patent-semantic-search.git

cd patent-semantic-search

pip install -r requirements.txt
</pre>

<hr>

<h2>▶️ Run the Patent Search Engine</h2>

<pre>
python3 search_patents.py
</pre>

Example:

<pre>
Enter search query:
system and method for detecting air pockets within an agricultural field

Top Matches:

Title: system and method for detecting air pockets within an agricultural field

Abstract:
A system for detecting air pockets within soil during
seed planting operations using subsurface sensing
and non-contact sensors.
</pre>

<hr>

<h2>🧠 Technologies Used</h2>

<ul>
<li>Python</li>
<li>PostgreSQL</li>
<li>pgvector</li>
<li>OpenAI embeddings</li>
<li>Docker</li>
</ul>

<hr>

