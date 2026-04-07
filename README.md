# Smart Research Assistant

A web-based intelligent research assistant that combines Local Knowledge Retrieval (RAG via FAISS) with Web Fallback (Tavily AI), powered by Google Gemini.
Users upload documents and an AI agent answers questions using those documents, with the ability to use tools when the documents aren’t enough.
## Features

- **Upload PDFs**: Extract text, chunk securely, and parse automatically
- **Local Embeddings**: Uses open-source `BAAI/bge-small-en-v1.5` for completely local, free embedding generation
- **RAG Generation**: Leverages Google Gemini models to generate high-quality answers with direct citations
- **Web Search Fallback**: If standard retrieved documents aren't relevant (similarity score < 0.4), dynamically fails over to web search using Tavily
- **Conversation Memory**: Maintains history to answer follow-ups correctly
- **Beautiful UI**: Glassmorphic, dark-mode focused React frontend

## Setup Commands

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Fill in your Tavily API Key in .env
# TAVILY_API_KEY=your_key_here

uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20
npm install
npm run dev
```

*Note: Your Gemini API key is provided directly in the frontend UI, not in the backend config.*
