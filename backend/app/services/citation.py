def format_citations(documents) -> list[dict]:
    """
    Converts LangChain Documents into citation dicts.
    """
    citations = []
    for doc in documents:
        snippet = doc.page_content[:150].replace('\n', ' ') + "..."
        citations.append({
            "document_name": doc.metadata.get("document_name", "Unknown File"),
            "page_number": doc.metadata.get("page_number", "Unknown Page"),
            "snippet": snippet,
            "text": f"According to *{doc.metadata.get('document_name')} (Page {doc.metadata.get('page_number')})*, {snippet}"
        })
    return citations

def get_confidence_score(documents_with_scores) -> str:
    """
    FAISS returns L2 distance. Lower distance = higher similarity.
    This is a basic heuristic for confidence.
    """
    if not documents_with_scores:
        return "Low"
        
    # Get the best (lowest) distance
    best_score = documents_with_scores[0][1]
    
    # These thresholds are heuristic and may need tuning based on the embedding model
    # For bge-m3, normalized embeddings typically have L2 distance between 0 and 2.
    if best_score < 0.8:
        return "High"
    elif best_score < 1.2:
        return "Medium"
    else:
        return "Low"
