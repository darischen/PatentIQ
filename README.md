
<h1 align="center">Patent Semantic Search Engine</h1>

<p align="center">
AI-powered patent search using <b>vector embeddings + hybrid scoring</b>
</p>

<p align="center">
<img src="https://img.shields.io/badge/Python-3.9+-blue">
<img src="https://img.shields.io/badge/PostgreSQL-pgvector-green">
<img src="https://img.shields.io/badge/AI-Semantic%20Search-orange">
<img src="https://img.shields.io/badge/License-MIT-lightgrey">
</p>

<hr>

<h2>Project Overview</h2>

<p>
This project implements a <b>semantic patent search system</b> that retrieves relevant patents using modern AI techniques including:
</p>

<ul>
<li>Vector Embeddings</li>
<li>Hybrid Ranking (Vector + Keyword)</li>
<li>Keyword Expansion</li>
<li>CPC Classification Suggestion</li>
</ul>

<p>
The goal is to improve traditional patent search by combining <b>semantic similarity with keyword matching</b>.
</p>

<hr>

<h2>Architecture</h2>

<pre>
<h2>Data Science system Architecture</h2>

<pre>
                        
                         ┌───────────────────────────┐
                         │          USER              │
                         │ enters patent idea/query   │
                         │                           │
                         │ "system for detecting     │
                         │  air pockets in soil"     │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────┐
                       │       QUERY PROCESSING     │
                       │                           │
                       │ • Normalize user idea     │
                       │ • Remove noise words      │
                       │ • Prepare search query    │
                       └─────────────┬─────────────┘
                                     │
                                     ▼
                     ┌──────────────────────────────┐
                     │     EMBEDDING GENERATION     │
                     │                              │
                     │ OpenAI embedding model       │
                     │ converts query → vector      │
                     │                              │
                     │ Example:                     │
                     │ [0.21, -0.17, 0.82, ...]     │
                     └─────────────┬────────────────┘
                                   │
                                   ▼
                   ┌───────────────────────────────────┐
                   │        VECTOR DATABASE            │
                   │                                   │
                   │ PostgreSQL + pgvector             │
                   │                                   │
                   │ Stored data:                      │
                   │ • Patent Title                    │
                   │ • Patent Abstract                 │
                   │ • Embedding Vector                │
                   │                                   │
                   │ Similarity Search                 │
                   │ using cosine distance             │
                   └─────────────┬─────────────────────┘
                                 │
                                 ▼
                 ┌─────────────────────────────────┐
                 │      CANDIDATE PATENT SET       │
                 │                                 │
                 │ Top K similar patents returned  │
                 │ from pgvector similarity search │
                 └─────────────┬───────────────────┘
                               │
                               ▼
                ┌─────────────────────────────────┐
                │        HYBRID SCORING           │
                │                                 │
                │ Combine:                        │
                │                                 │
                │ Vector Similarity Score         │
                │ + Keyword Matching Score        │
                │ + CPC Relevance (optional)      │
                │                                 │
                │ Final ranking generated         │
                └─────────────┬───────────────────┘
                              │
                              ▼
                ┌─────────────────────────────────┐
                │         RESULT RANKING          │
                │                                 │
                │ Top matching patents displayed  │
                │                                 │
                │ Title                           │
                │ Abstract                        │
                │ Similarity relevance            │
                └─────────────┬───────────────────┘
                              │
                              ▼
                ┌─────────────────────────────────┐
                │         TERMINAL OUTPUT         │
                │                                 │
                │ Top Matches:                    │
                │                                 │
                │ Title: system and method ...    │
                │ Abstract: ...                   │
                │                                 │
                │ Title: system and method ...    │
                │ Abstract: ...                   │
                └─────────────────────────────────┘
</pre>
</pre>

<hr>

<h2>Features</h2>

<ul>
<li>Semantic patent search using embeddings</li>
<li>Hybrid scoring model (vector similarity + keyword score)</li>
<li>Keyword expansion for better recall</li>
<li>CPC classification suggestions</li>
<li>Patent idea normalization prompts</li>
</ul>

<hr>

<h2>Project Structure</h2>

<pre>
patent-semantic-search
│
├── database
│   └── patent ingestion scripts
│
├── patentiq
│   ├── hybrid_scoring.py
│   ├── keyword_expansion.py
│   └── cpc_classifier.py
│
├── test_patentiq.py
├── docker-compose.yml
└── README.md
</pre>

<hr>

<h2>Installation</h2>

<pre>
git clone https://github.com/NATASHASAINI/patent-semantic-search.git

cd patent-semantic-search

pip install -r requirements.txt
</pre>

<hr>

<h2>Run Example</h2>

<pre>
python3 patentiq/hybrid_scoring.py
</pre>

Example Output:

<pre>
Expanded Keywords: ['tractor','planting','soil']
Keyword Score: 4
Suggested CPC: ['A01B','A01C']
</pre>

<hr>

<h2>Future Improvements</h2>

<ul>
<li>LLM-based patent idea normalization</li>
<li>Automated novelty detection</li>
<li>Prior art search</li>
<li>Patent similarity ranking</li>
<li>Web interface for search</li>
</ul>

<hr>

<h2>Tech Stack</h2>

<ul>
<li>Python</li>
<li>PostgreSQL</li>
<li>pgvector</li>
<li>OpenAI embeddings</li>
<li>Docker</li>
</ul>

