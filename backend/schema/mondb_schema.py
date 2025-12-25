from pydantic import BaseModel
from typing import List
from datetime import datetime
from langchain_core.messages import BaseMessage


class UserSchema(BaseModel):
    username: str
    password: str
    created_at: datetime


class ChatSchema(BaseModel):
    user_id: str
    last_updated: datetime
    messages: List[BaseMessage]