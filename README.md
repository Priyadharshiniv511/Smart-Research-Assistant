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

## Challenges and Solutions

During the development of this Smart Research Assistant, we faced several technical challenges that required creative solutions:

1. **Integrating Multiple AI Services**: Combining local embeddings with cloud-based LLMs and web search tools was tricky. I solved this by using LangChain's modular architecture, which allowed me to chain different components seamlessly while maintaining clean separation of concerns.

2. **Tavily API Key Configuration**: The web search functionality initially failed because the TavilySearchResults tool wasn't receiving the API key. I fixed this by explicitly passing the `tavily_api_key` parameter from our settings configuration to the tool initialization.

3. **Handling PDF Text Extraction**: Extracting clean, usable text from PDFs proved challenging due to varying document formats. I implemented a robust extraction pipeline using PyPDF2 that handles up to 10 pages per document and includes metadata for better citation tracking.

4. **Memory Management in Conversations**: Maintaining context across multiple queries required careful state management. I implemented a conversation memory service that stores and retrieves relevant history to provide coherent follow-up responses.

These challenges helped me build a more robust and flexible system that can handle real-world research scenarios effectively.

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
