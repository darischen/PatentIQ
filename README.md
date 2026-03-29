# Patentiq AI

AI-powered patent search and drafting assistant built to simplify Patent Websites (USPTO, Google Patents) research for students, inventors, and early-stage founders.

---

## The Problem

Patent search is complex, time-consuming, and expensive.  
Students and early-stage innovators often struggle to access professional-level research tools.

Patentiq AI exists to remove that barrier.

---

## The Solution

Patentiq AI uses Large Language Models (LLMs) combined with USPTO data to:

- Analyze user-submitted ideas
- Query patent databases via API
- Identify related, pending, or approved patents
- Provide structured recommendations
- Offer AI-assisted patent drafting

---

## Core Features (MVP)

- Idea submission (text or document upload)
- USPTO API integration
- LLM-based analysis and similarity detection
- Recommendation engine
- Drafting suggestion flow

---

## Tech Stack

- Python (FastAPI)
- OpenAI API
- USPTO Data API
- JWT Authentication with Auth0
- PostgreSQL with pgvector
- Next.js
- Vercel
- Supabase
- EC2 (Planned)

---

## Architecture Overview

User → API → LLM → Patent Database → Analysis Engine → Recommendation Output

---

## Getting Started

### 1. Clone the repo

``` git clone https://github.com/haileasy-debug/PatentIQ-ai.git ```

### 2. Install Dependencies

### 3.
