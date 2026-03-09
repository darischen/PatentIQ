<!DOCTYPE html>
<html>
<head>
</head>
<body>

<h1> Patent Semantic Search Engine</h1>

<p>
An AI-powered semantic patent search engine using <b>OpenAI embeddings</b> and 
<b>PostgreSQL with pgvector</b>.
</p>

<p>This project allows users to:</p>

<ul>
<li>Generate embeddings for patent abstracts</li>
<li>Store embeddings in PostgreSQL using pgvector</li>
<li>Perform semantic similarity search over patents</li>
</ul>

<hr>

<h2> Tech Stack</h2>

<ul>
<li>Python 3.11</li>
<li>OpenAI Embeddings (<code>text-embedding-3-small</code>)</li>
<li>PostgreSQL</li>
<li>pgvector</li>
<li>psycopg2</li>
</ul>

<hr>

<h2>Architecture Overview</h2>

<pre>
User Query
    ↓
OpenAI Embedding API
    ↓
Query Vector (1536-dim)
    ↓
PostgreSQL + pgvector
    ↓
Vector Similarity Search (<->)
    ↓
Top-K Patent Results
</pre>

<hr>

<h2> Project Structure</h2>

<pre>
patent-semantic-search/
│
├── embed_patents.py      # Generates and stores patent embeddings
├── search_patents.py     # Performs semantic similarity search
├── test_openai.py        # Tests embedding API
├── requirements.txt
├── .gitignore
└── README.md
</pre>

<hr>

<h2>⚙ Environment Setup</h2>

<p>Set your OpenAI API key:</p>

<pre><code>
export OPENAI_API_KEY="your-api-key"
</code></pre>

</body>
</html>
