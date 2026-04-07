from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from app.services.embeddings import get_embedding_model

class VectorStoreService:
    def __init__(self):
        self.vector_store = None
        self.embedding_model = get_embedding_model()

    def add_documents(self, chunks: list[dict]):
        """
        Adds document chunks to the FAISS vector store.
        If it doesn't exist, initializes it.
        chunks: List of dicts with 'page_content' and 'metadata'.
        """
        docs = [Document(page_content=c["page_content"], metadata=c["metadata"]) for c in chunks]
        
        if self.vector_store is None:
            self.vector_store = FAISS.from_documents(docs, self.embedding_model)
        else:
            self.vector_store.add_documents(docs)

    def similarity_search_with_score(self, query: str, top_k: int = 5) -> list[tuple[Document, float]]:
        """
        Performs similarity search against the vector store.
        Returns top_k matching documents with their L2 distance scores.
        """
        if self.vector_store is None:
            return []
            
        # FAISS returns distances (lower is closer/better similarity)
        results = self.vector_store.similarity_search_with_score(query, k=top_k)
        return results

# Singleton instance
vector_store_service = VectorStoreService()

def get_vector_store():
    return vector_store_service
