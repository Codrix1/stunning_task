from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from langchain_core.messages import BaseMessage

class User(BaseModel):
    id: Optional[str] = None
    username: str
    hashed_password: str
    created_at: datetime


class Chat(BaseModel):
    id: Optional[str] = None
    user_id: str
    last_updated: datetime
    messages: List[BaseMessage]