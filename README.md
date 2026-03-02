Patent Semantic Search

A powerful semantic search system for patent data that generates vector embeddings using OpenAI models and retrieves patents based on meaning — not just keywords.

This project enables intelligent patent discovery through vector similarity search.

🧠 Overview

Traditional patent search depends on exact keyword matching, often missing relevant inventions described differently.

This system solves that by:

Converting patent text into vector embeddings

Storing and indexing embeddings

Comparing semantic similarity with user queries

Ideal for:

🔍 Prior-art search

📄 Similar patent discovery

📊 Patent clustering and analytics

🤖 AI-driven IP research tools

🏗️ System Architecture
                ┌──────────────────────┐
                │   Patent Dataset     │
                │ (CSV / JSON / Text)  │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  embed_patents.py    │
                │  (Generate Embeddings)
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  Stored Embeddings   │
                │  (PKL / Vector DB)   │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
User Query ───► │ search_patents.py   │
                │ (Query Embedding +   │
                │  Similarity Search)  │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Ranked Similar       │
                │ Patent Results       │
                └──────────────────────┘
⚙️ Step-by-Step Workflow


Step 1: Data Preparation

Collect patent data (title, abstract, description)

Store in CSV, JSON, or text format

Ensure clean and structured text

Step 2: Generate Embeddings

Script: embed_patents.py

What it does:

Reads patent text

Sends text to OpenAI embedding model

Generates vector embeddings

Saves embeddings locally (.pkl file or similar)

Run:

python embed_patents.py --input data/patents.csv --output data/embeddings.pkl

Output:

Serialized file containing patent text + embeddings

Step 3: Store Embeddings

Currently:

Stored locally using Pickle

Optional extension:

FAISS (for fast similarity search)

Pinecone (cloud vector DB)

Qdrant / Weaviate

Step 4: Perform Semantic Search

Script: search_patents.py

What it does:

Converts user query to embedding

Computes cosine similarity with stored embeddings

Ranks patents by similarity score

Returns top matching results

Run:

python search_patents.py --embeddings data/embeddings.pkl --query "machine learning for autonomous vehicles"

Output:

Ranked list of semantically similar patents

Step 5: API Test (Optional)

Script: test_openai.py

python test_openai.py

Verifies OpenAI API connectivity.

📁 Repository Structure
patent-semantic-search/
│
├── embed_patents.py      # Generate and store embeddings
├── search_patents.py     # Perform semantic similarity search
├── test_openai.py        # Test OpenAI API connection
├── requirements.txt      # Project dependencies
└── README.md             # Documentation
🚀 Key Features

Semantic patent search using vector embeddings

Lightweight Python implementation

Works with structured patent datasets

Easily extendable to large-scale vector databases

Modular architecture for research experimentation

🛠️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/NATASHASAINI/patent-semantic-search.git
cd patent-semantic-search
2️⃣ Create Virtual Environment
python3 -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
3️⃣ Install Dependencies
pip install -r requirements.txt
4️⃣ Set OpenAI API Key

Mac/Linux:

export OPENAI_API_KEY="your_openai_api_key"

Windows:

setx OPENAI_API_KEY "your_openai_api_key"
📊 How It Works (Technical Flow)

Patent text → OpenAI embedding model

Embedding stored as high-dimensional vector

User query → converted to embedding

Cosine similarity computed

Results ranked by similarity score

Unlike keyword search, this captures contextual meaning and conceptual similarity.


