

<h1 align="center">Patent Semantic Search Engine</h1>
<p align="center">
AI-powered patent search using <b>vector embeddings + hybrid scoring</b>
=======
<h1 align="center">🔎 Patent Semantic Search Engine</h1>

<p align="center">
AI-powered patent search using <b>semantic embeddings, PostgreSQL, and hybrid ranking</b>
</p>

<p align="center">
<img src="https://img.shields.io/badge/Python-3.9+-blue">
<img src="https://img.shields.io/badge/PostgreSQL-pgvector-green">
<img src="https://img.shields.io/badge/AI-Semantic%20Search-orange">

=======
<img src="https://img.shields.io/badge/Docker-Enabled-blue">

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
=======
<h2>📌 Overview</h2>

<p>
This project implements a <b>semantic patent search engine</b> that retrieves patents based on meaning rather than exact keywords.
</p>

<p>
The system converts patent text and user queries into numerical vectors (embeddings) and performs similarity search using <b>PostgreSQL with pgvector</b>.

</p>

<hr>

<<<<<<< HEAD
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
=======
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
>>>>>>> b85fe5f (Update README with architecture and HTML documentation)
</pre>

<hr>

<<<<<<< HEAD
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
=======
<h2>📂 Project Structure</h2>
>>>>>>> b85fe5f (Update README with architecture and HTML documentation)

<pre>
patent-semantic-search
│
├── database
<<<<<<< HEAD
│   └── patent ingestion scripts
=======
>>>>>>> b85fe5f (Update README with architecture and HTML documentation)
│
├── patentiq
│   ├── hybrid_scoring.py
│   ├── keyword_expansion.py
│   └── cpc_classifier.py
│
<<<<<<< HEAD
=======
├── search_patents.py
>>>>>>> b85fe5f (Update README with architecture and HTML documentation)
├── test_patentiq.py
├── docker-compose.yml
└── README.md
</pre>

<hr>

<<<<<<< HEAD
<h2>Installation</h2>
=======
<h2>⚙️ Installation</h2>
>>>>>>> b85fe5f (Update README with architecture and HTML documentation)

<pre>
git clone https://github.com/NATASHASAINI/patent-semantic-search.git

cd patent-semantic-search

pip install -r requirements.txt
</pre>

<hr>

<<<<<<< HEAD
<h2>Run Example</h2>

<pre>
python3 patentiq/hybrid_scoring.py
</pre>

Example Output:

<pre>
Expanded Keywords: ['tractor','planting','soil']
Keyword Score: 4
Suggested CPC: ['A01B','A01C']
=======
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
>>>>>>> b85fe5f (Update README with architecture and HTML documentation)
</pre>

<hr>

<<<<<<< HEAD
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
=======
<h2>🧠 Technologies Used</h2>
>>>>>>> b85fe5f (Update README with architecture and HTML documentation)

<ul>
<li>Python</li>
<li>PostgreSQL</li>
<li>pgvector</li>
<li>OpenAI embeddings</li>
<li>Docker</li>
</ul>

<<<<<<< HEAD
=======
<hr>

<h2>🔮 Future Improvements</h2>

<ul>
<li>Web UI for patent search</li>
<li>LLM-powered invention idea analysis</li>
<li>Patent novelty detection</li>
<li>Prior-art patent analysis</li>
</ul>

<hr>

<h2>📜 License</h2>

<p>MIT License</p>
>>>>>>> b85fe5f (Update README with architecture and HTML documentation)
