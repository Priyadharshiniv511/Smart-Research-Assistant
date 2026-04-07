from fastapi import APIRouter, File, UploadFile, HTTPException
from app.utils.pdf_loader import extract_text_from_pdf
from app.utils.chunking import chunk_documents
from app.services.vector_store import get_vector_store

router = APIRouter()

@router.post("/upload")
async def upload_documents(files: list[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")
        
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 files allowed.")
        
    all_chunks = []
    
    for file in files:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PDF.")
            
        file_bytes = await file.read()
        
        # 1. Extract text and metadata
        try:
            documents = extract_text_from_pdf(file_bytes, file.filename)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading {file.filename}: {e}")
            
        # 2. Chunk documents
        chunks = chunk_documents(documents)
        all_chunks.extend(chunks)
        
    # 3. Add to vector store
    if all_chunks:
        vector_store = get_vector_store()
        vector_store.add_documents(all_chunks)
        
    return {
        "message": "Files successfully processed and added to the knowledge base.",
        "documents_processed": len(files),
        "chunks_created": len(all_chunks)
    }
