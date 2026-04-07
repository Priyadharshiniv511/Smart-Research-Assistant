from langchain.text_splitter import RecursiveCharacterTextSplitter 
import uuid

def chunk_documents(documents: list[dict]) -> list[dict]:
    """
    Chunks a list of dicts (from pdf_loader) into smaller pieces.
    Returns chunks with metadata including a chunk_id.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        length_function=len,
        is_separator_regex=False,
    )
    
    chunks = []
    for doc in documents:
        page_chunks = text_splitter.split_text(doc["page_content"])
        for chunk in page_chunks:
            chunk_metadata = doc["metadata"].copy()
            chunk_metadata["chunk_id"] = str(uuid.uuid4())
            chunks.append({
                "page_content": chunk,
                "metadata": chunk_metadata
            })
    return chunks
