from langchain.embeddings import HuggingFaceEmbeddings

class EmbeddingService:
    def __init__(self):
        # We use BAAI/bge-m3 as requested globally available
        self.embeddings = HuggingFaceEmbeddings(
            model_name="BAAI/bge-m3",
            model_kwargs={'device': 'cpu'}, # Use CPU for local processing safety
            encode_kwargs={'normalize_embeddings': True}
        )

    def get_embeddings(self):
        return self.embeddings

# Singleton
embedding_service = EmbeddingService()

def get_embedding_model():
    return embedding_service.get_embeddings()
