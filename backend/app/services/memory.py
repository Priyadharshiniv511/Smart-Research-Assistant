from typing import Dict, List
from langchain_core.messages import HumanMessage, AIMessage

class MemoryService:
    def __init__(self):
        # Store memories as session_id -> list of Messages
        self.store: Dict[str, List] = {}
        self.max_messages = 5 * 2 # 5 exchanges = 10 messages

    def add_user_message(self, session_id: str, message: str):
        if session_id not in self.store:
            self.store[session_id] = []
        self.store[session_id].append(HumanMessage(content=message))
        self._trim_memory(session_id)

    def add_ai_message(self, session_id: str, message: str):
        if session_id not in self.store:
            self.store[session_id] = []
        self.store[session_id].append(AIMessage(content=message))
        self._trim_memory(session_id)

    def get_memory(self, session_id: str) -> List:
        return self.store.get(session_id, [])

    def _trim_memory(self, session_id: str):
        if len(self.store[session_id]) > self.max_messages:
            self.store[session_id] = self.store[session_id][-self.max_messages:]

# Singleton to maintain in-memory state across requests
memory_service = MemoryService()

def get_memory_service():
    return memory_service
