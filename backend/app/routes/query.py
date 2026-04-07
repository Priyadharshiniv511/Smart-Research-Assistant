from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from app.services.rag_pipeline import process_query

router = APIRouter()

class QueryRequest(BaseModel):
    question: str
    session_id: str

@router.post("/query")
async def handle_query(request: QueryRequest, x_gemini_api_key: Optional[str] = Header(None)):
    if not request.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    if not request.session_id:
        raise HTTPException(status_code=400, detail="Session ID is required.")
    if not x_gemini_api_key:
        raise HTTPException(status_code=401, detail="Gemini API Key is missing in headers.")
        
    try:
        response_data = process_query(
            query=request.question,
            session_id=request.session_id,
            gemini_api_key=x_gemini_api_key
        )
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
