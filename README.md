Patent Semantic Search

A simple yet powerful semantic search system for patent data that generates vector embeddings using OpenAI models and performs similarity-based search.

This project enables intelligent patent discovery by understanding the meaning behind text — not just keyword matching.

🧠 Overview

Traditional patent search relies heavily on keyword matching, which often misses semantically similar inventions described using different terminology.

This project solves that problem by:

Generating vector embeddings for patent text using OpenAI models

Storing and indexing those embeddings

Performing semantic similarity search against user queries

It is ideal for:

🔍 Prior-art search

📄 Similar patent discovery

📊 Patent analytics and clustering

🤖 AI-powered IP research tools

📁 Repository Structure
patent-semantic-search/
│
├── embed_patents.py      # Generate and store embeddings for patent data
├── search_patents.py     # Perform semantic search on stored embeddings
├── test_openai.py        # Test OpenAI API connectivity
├── requirements.txt      # Python dependencies
└── README.md             # Project documentation
🚀 Features

Uses OpenAI embedding models to capture semantic meaning

Simple and lightweight Python implementation

Easily adaptable to CSV, JSON, or text-based patent datasets

Extendable to vector databases (FAISS, Pinecone, etc.)

Modular design for experimentation and research

🛠️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/NATASHASAINI/patent-semantic-search.git
cd patent-semantic-search
2️⃣ Create Virtual Environment (Recommended)
python3 -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
3️⃣ Install Dependencies
pip install -r requirements.txt
4️⃣ Set OpenAI API Key

Set your environment variable:

Mac/Linux

export OPENAI_API_KEY="your_openai_api_key"

Windows

setx OPENAI_API_KEY "your_openai_api_key"
📥 Generating Embeddings

Run the embedding script to process your patent dataset:

python embed_patents.py --input data/patents.csv --output data/embeddings.pkl

This script:

Reads patent text

Generates embeddings

Saves them locally for later search

You can modify the script to support your specific data format.

🔍 Performing Semantic Search

After generating embeddings:

python search_patents.py --embeddings data/embeddings.pkl --query "machine learning for autonomous vehicles"

The system returns patents ranked by semantic similarity to the query.

🧪 Testing OpenAI Connection

To verify your API key is working:

python test_openai.py
📊 How It Works (High-Level)

Convert patent text → vector embeddings

Store embeddings in a file or vector store

Convert user query → embedding

Compute cosine similarity

Return most similar patents

This allows semantic understanding rather than exact word matching.
