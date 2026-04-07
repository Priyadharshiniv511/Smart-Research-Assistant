import os
import pypdf
from io import BytesIO

def extract_text_from_pdf(file_bytes: bytes, filename: str) -> list[dict]:
    """
    Extracts text from a PDF file as bytes, up to 10 pages.
    Returns: A list of dicts: [{"text": str, "metadata": dict}]
    """
    reader = pypdf.PdfReader(BytesIO(file_bytes))
    docs = []
    num_pages = min(len(reader.pages), 10) # Max 10 pages per file as per req
    
    for page_num in range(num_pages):
        page = reader.pages[page_num]
        text = page.extract_text()
        if text:
            # Clean up text if needed
            docs.append({
                "page_content": text,
                "metadata": {
                    "document_name": filename,
                    "page_number": page_num + 1,
                }
            })
    return docs
