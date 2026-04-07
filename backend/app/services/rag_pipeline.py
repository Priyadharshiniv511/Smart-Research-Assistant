from app.services.vector_store import get_vector_store
from app.services.agent import create_agent_for_session, create_llm
from app.services.memory import get_memory_service
from app.services.citation import format_citations, get_confidence_score
from langchain_core.messages import HumanMessage, AIMessage

def process_query(query: str, session_id: str, gemini_api_key: str) -> dict:
    vector_store = get_vector_store()
    memory_service = get_memory_service()
    
    # 1. Retrieve relevant chunks
    docs_with_scores = vector_store.similarity_search_with_score(query, top_k=5)
    
    # Extract just documents
    docs = [doc for doc, score in docs_with_scores] if docs_with_scores else []
    
    confidence = get_confidence_score(docs_with_scores)
    
    # Construct context from docs
    context = ""
    citations = []
    
    # If we have documents, we build the context
    if docs:
        context = "\\n\\n".join([doc.page_content for doc in docs])
        citations = format_citations(docs)
    
    # Prepare previous memory
    past_messages = memory_service.get_memory(session_id)
    history_text = "\\n".join([f"{'User' if isinstance(m, HumanMessage) else 'AI'}: {m.content}" for m in past_messages])
    
    source = "rag"
    answer = ""
    
    if len(docs) == 0 or confidence == "Low":
        # Force fallback if no docs or low confidence - use agent for web search
        agent = create_agent_for_session(gemini_api_key)
        
        prompt = f"""
This is a prior conversation history:
{history_text}

Question: {query}
"""
        # We couldn't find it in local docs, we tell the system to use web tools.
        system_prefix = "The user asked a question that was not found in their uploaded documents. Start your answer exactly with: 'This is not found in uploaded documents. Based on web search: ' and then answer the question using the Web Search tool."
        
        try:
            res = agent.invoke({"input": system_prefix + "\\n" + prompt})
            answer = res.get("output", "Could not fetch an answer.")
            source = "web"
        except Exception as e:
            answer = f"Error during agent web search: {e}"
            source = "error"
    else:
        # Prompt for RAG - use direct LLM (no agent needed since we have context)
        llm = create_llm(gemini_api_key)
        
        prompt = f"""
You are a helpful Research Assistant. 
Previous conversation:
{history_text}

Use the following Context to answer the user's question. 
Context: {context}

Question: {query}
"""
        try:
            # Direct LLM call for RAG responses
            response = llm.invoke(prompt)
            answer = response.content
        except Exception as e:
             answer = f"Error generating answer: {e}"
             source = "error"

    # Save to memory
    memory_service.add_user_message(session_id, query)
    memory_service.add_ai_message(session_id, answer)

    return {
        "answer": answer,
        "citations": citations if source == "rag" else [],
        "source": source,
        "confidence": confidence if source == "rag" else "N/A"
    }
