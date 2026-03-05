<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10-blue">
  <img src="https://img.shields.io/badge/PostgreSQL-pgvector-blue">
  <img src="https://img.shields.io/badge/OpenAI-Embeddings-green">
  <img src="https://img.shields.io/badge/Status-Active-success">
</p>

<h1 align="center">🚀 Patent Semantic Search Engine</h1>

<p align="center">
A production-ready semantic search system for patent datasets using 
<b>OpenAI Embeddings</b> and <b>PostgreSQL + pgvector</b>.
<br><br>
🔎 Search patents by <b>meaning</b>, not just keywords.
</p>

<hr>

<h2>📌 Overview</h2>

<p>
Traditional patent search relies heavily on keyword matching. 
However, semantically similar inventions often use different terminology.
</p>

<p><b>This system solves that by:</b></p>

<ul>
  <li>Parsing patent files (CSV / XML / JSON)</li>
  <li>Generating vector embeddings using OpenAI</li>
  <li>Storing embeddings in PostgreSQL using pgvector</li>
  <li>Performing semantic similarity search via vector distance</li>
  <li>Returning ranked, contextually relevant results</li>
</ul>

<hr>

<h2>🎯 Use Cases</h2>

<ul>
  <li>🔍 Prior-art discovery</li>
  <li>📄 Similar patent identification</li>
  <li>📊 Patent clustering & analytics</li>
  <li>🤖 AI-powered IP research tools</li>
  <li>⚖️ Legal and innovation intelligence workflows</li>
</ul>

<hr>

<h2>🏗️ System Architecture</h2>

<pre>
┌──────────────────────────────┐
│   Patent Files (CSV/XML)     │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│      Patent Parser           │
│  (Extract Title/Abstract)    │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│  Text Preprocessing Layer    │
│ (Combine fields for input)   │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│   OpenAI Embedding API       │
│   (Generate Vectors)         │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│ PostgreSQL + pgvector        │
│ (Vector Storage + Indexing)  │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│  Semantic Query Engine       │
│  (Vector Similarity Search)  │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│  Ranked Patent Results       │
└──────────────────────────────┘
</pre>

<hr>

<h2>⚙️ End-to-End Workflow</h2>

<h3>Step 1 — Patent Data Ingestion</h3>

<ul>
  <li>Extract Patent ID</li>
  <li>Title</li>
  <li>Abstract</li>
  <li>Description</li>
  <li>Claims </li>
</ul>

<p>Example:</p>

<pre><code>python parse_patents.py --input data/patents.xml --output data/patents.csv</code></pre>

<hr>

<h3>Step 2 — Generate & Store Embeddings</h3>

<pre><code>python embed_and_store.py --input data/patents.csv</code></pre>

<ol>
  <li>Combine patent text fields</li>
  <li>Generate embedding via OpenAI</li>
  <li>Store embedding vector in PostgreSQL</li>
  <li>Create vector index (IVFFlat / HNSW)</li>
</ol>

<hr>

<h3>Step 3 — Perform Semantic Search</h3>

<pre><code>python search_patents.py --query "machine learning for autonomous vehicles"</code></pre>

<p><b>Under the hood:</b></p>

<ul>
  <li>Convert query → embedding</li>
  <li>Run PostgreSQL vector similarity search</li>
  <li>Rank results by cosine/L2 distance</li>
  <li>Return top-K matches</li>
</ul>

<p>Example SQL:</p>

<pre><code>
SELECT patent_id, title
FROM patents
ORDER BY embedding &lt;=&gt; query_embedding
LIMIT 10;
</code></pre>

<hr>

<h2>🗄 Database Schema</h2>

<pre><code>
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE patents (
    id SERIAL PRIMARY KEY,
    patent_id TEXT,
    title TEXT,
    abstract TEXT,
    description TEXT,
    embedding vector(1536)
);

CREATE INDEX patents_embedding_idx
ON patents
USING ivfflat (embedding vector_cosine_ops);
</code></pre>

<hr>

<h2>📁 Repository Structure</h2>

<pre>
patent-semantic-search/
│
├── parse_patents.py
├── embed_and_store.py
├── search_patents.py
├── test_openai.py
├── requirements.txt
└── README.md
</pre>

<hr>

<h2>🛠 Installation</h2>

<h3>1️⃣ Clone Repository</h3>

<pre><code>
git clone https://github.com/NATASHASAINI/patent-semantic-search.git
cd patent-semantic-search
</code></pre>

<h3>2️⃣ Create Virtual Environment</h3>

<pre><code>
python3 -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows
</code></pre>

<h3>3️⃣ Install Dependencies</h3>

<pre><code>
pip install -r requirements.txt
</code></pre>

<h3>4️⃣ Configure Environment Variables</h3>

<p><b>Mac/Linux:</b></p>

<pre><code>
export OPENAI_API_KEY="your_openai_api_key"
export DATABASE_URL="postgresql://user:password@localhost:5432/patents"
</code></pre>

<p><b>Windows:</b></p>

<pre><code>
setx OPENAI_API_KEY "your_openai_api_key"
setx DATABASE_URL "postgresql://user:password@localhost:5432/patents"
</code></pre>

<hr>

<h2>📈 Performance Considerations</h2>

<ul>
  <li>Hybrid relational + vector queries</li>
  <li>IVFFlat / HNSW indexing</li>
  <li>Batch embedding generation</li>
  <li>Optimized SQL filtering + ranking</li>
  <li>Scales to millions of records with indexing</li>
</ul>

<hr>

<h2>🧠 Why pgvector Instead of any other Vector Database?</h2>

<ul>
  <li>Single SQL + vector database</li>
  <li>No external SaaS dependency</li>
  <li>Lower infrastructure cost</li>
  <li>Full control over schema & indexing</li>
</ul>

<p>
Ideal for research prototypes and production systems already using PostgreSQL.
</p>

<hr>

<p align="center">
<b>Built for AI-powered Patent Intelligence & Semantic IP Discovery.</b>
</p>
