# 🧠 Patent Semantic Search Engine

An AI-powered semantic patent search engine using OpenAI embeddings and PostgreSQL with pgvector.

This project allows users to:
- Generate embeddings for patent abstracts
- Store embeddings in PostgreSQL using pgvector
- Perform semantic similarity search over patents

---

## 🚀 Tech Stack

- Python 3.11
- OpenAI Embeddings (`text-embedding-3-small`)
- PostgreSQL
- pgvector
- psycopg2

---

## 🏗️ Architecture Overview

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

---

## 📂 Project Structure
patent-semantic-search/
│
├── embed_patents.py # Generates and stores patent embeddings
├── search_patents.py # Performs semantic similarity search
├── test_openai.py # Tests embedding API
├── requirements.txt
├── .gitignore
└── README.md

---

## 🔐 Environment Setup

Set your OpenAI key:

```bash
export OPENAI_API_KEY="your-api-key"
