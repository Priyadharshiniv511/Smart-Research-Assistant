import os
from langchain.agents import initialize_agent, AgentType, Tool
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from app.services.vector_store import get_vector_store
from app.services.memory import get_memory_service
from app.services.citation import format_citations, get_confidence_score
from app.config.settings import settings

def fallback_web_search(query: str) -> str:
    """
    A direct web search wrapper that returns the result string.
    Tavily search is used when the vector store doesn't have relevant documents.
    """
    tavily_tool = TavilySearchResults(max_results=3, tavily_api_key=settings.TAVILY_API_KEY)
    return tavily_tool.invoke({"query": query})

def create_llm(gemini_api_key: str):
    """
    Creates just the LLM for direct responses (used for RAG with context).
    """
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash", 
        google_api_key=gemini_api_key,
        temperature=0.2,
        convert_system_message_to_human=True
    )

def create_agent_for_session(gemini_api_key: str):
    """
    Creates the LLM and the tools for the agent for a specific session/request.
    Only use this when you need web search capability.
    """
    llm = create_llm(gemini_api_key)

    tools = [
        Tool(
            name="Web Search",
            func=fallback_web_search,
            description="Use this when answering questions about current events, or when you cannot find the answer in the uploaded documents."
        )
        # Note: We will handle document retrieval manually before invoking the agent,
        # to ensure we capture the specific citations precisely.
    ]

    # Initialize agent with iteration limit
    agent = initialize_agent(
        tools,
        llm,
        agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True,
        handle_parsing_errors=True,
        max_iterations=10,
        early_stopping_method="generate"
    )
    return agent
