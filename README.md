<p align="center">
<img src="https://img.shields.io/badge/Python-3.10-blue">
<img src="https://img.shields.io/badge/OpenAI-Embeddings-green">
<img src="https://img.shields.io/badge/Status-Active-success">
</p>

<h1 align="center">🚀 Patent Semantic Search</h1>

<p align="center">
A semantic search engine for patent data that generates vector embeddings using OpenAI models
and retrieves patents based on <b>meaning</b> — not just keywords.
</p>

<hr>

<h2>📌 Overview</h2>

<p>
Traditional patent search relies on keyword matching, which often misses semantically related inventions described using different terminology.
</p>

<p><b>This system solves that by:</b></p>

<ul>
  <li>Converting patent text into vector embeddings</li>
  <li>Storing and indexing embeddings</li>
  <li>Performing semantic similarity search against user queries</li>
</ul>

<p><b>Ideal For:</b></p>

<ul>
  <li>🔍 Prior-art search</li>
  <li>📄 Similar patent discovery</li>
  <li>📊 Patent clustering and analytics</li>
  <li>🤖 AI-powered IP research tools</li>
</ul>

<hr>

<h2>🏗️ System Architecture</h2>

<pre>
Patent Dataset (CSV / JSON / Text)
        │
        ▼
embed_patents.py
(Generate Embeddings)
        │
        ▼
Stored Embeddings (PKL / Vector DB)
        │
        ▼
search_patents.py
(Query → Embedding → Similarity)
        │
        ▼
Ranked Patent Results
</pre>

<hr>

<h2>⚙️ Step-by-Step Workflow</h2>

<h3>Step 1 — Prepare Patent Data</h3>
<ul>
  <li>Collect patent title, abstract, description</li>
  <li>Store in CSV / JSON / Text format</li>
</ul>

<h3>Step 2 — Generate Embeddings</h3>

<pre><code>python embed_patents.py --input data/patents.csv --output data/embeddings.pkl</code></pre>

<ol>
  <li>Patent text is sent to OpenAI embedding model</li>
  <li>Vector embeddings are generated</li>
  <li>Embeddings are saved locally</li>
</ol>

<h3>Step 3 — Perform Semantic Search</h3>

<pre><code>python search_patents.py --embeddings data/embeddings.pkl --query "machine learning for autonomous vehicles"</code></pre>

<ol>
  <li>Query is converted into embedding</li>
  <li>Cosine similarity is computed</li>
  <li>Patents are ranked by similarity score</li>
</ol>

<h3>Step 4 — Test API Connection (Optional)</h3>

<pre><code>python test_openai.py</code></pre>

<hr>

<h2>📁 Repository Structure</h2>

<pre>
patent-semantic-search/
│
├── embed_patents.py
├── search_patents.py
├── test_openai.py
├── requirements.txt
└── README.md
</pre>

<hr>

<h2>🛠 Installation</h2>

<h3>1️⃣ Clone Repository</h3>

<pre><code>git clone https://github.com/NATASHASAINI/patent-semantic-search.git
cd patent-semantic-search</code></pre>

<h3>2️⃣ Create Virtual Environment</h3>

<pre><code>python3 -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows</code></pre>

<h3>3️⃣ Install Dependencies</h3>

<pre><code>pip install -r requirements.txt</code></pre>

<h3>4️⃣ Set OpenAI API Key</h3>

<b>Mac/Linux:</b>

<pre><code>export OPENAI_API_KEY="your_openai_api_key"</code></pre>

<b>Windows:</b>

<pre><code>setx OPENAI_API_KEY "your_openai_api_key"</code></pre>

<hr>

<h2>🔬 How It Works</h2>

<ol>
  <li>Patent text → embedding vector</li>
  <li>Stored as high-dimensional representation</li>
  <li>User query → embedding vector</li>
  <li>Cosine similarity computed</li>
  <li>Top matches returned</li>
</ol>

<p>
This enables conceptual search instead of literal keyword matching.
</p>

<hr>

<h2>🚀 Future Improvements</h2>

<ul>
  <li>FAISS integration for large-scale search</li>
  <li>Streamlit UI</li>
  <li>FastAPI deployment</li>
  <li>USPTO bulk ingestion</li>
  <li>Vector database integration</li>
</ul>

<hr>

<hr>

<p align="center">
<b>Built for AI-powered patent intelligence.</b>
</p>
