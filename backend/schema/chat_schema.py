"""
Request/Response schemas for chat routes
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 1800


class MessageRequest(BaseModel):
    content: str


class MessageResponse(BaseModel):
    type: str
    content: str


class ChatResponse(BaseModel):
    id: str
    last_updated: datetime
    message_count: int
    title: Optional[str] = None


class ChatsResponse(BaseModel):
    user_id: str
    chat_count: int
    chats: List[ChatResponse]


class LLMRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None


class LLMResponse(BaseModel):
    chat_id: str
    user_message: str
    llm_response: str


class CreateChatResponse(BaseModel):
    message: str
    chat_id: str
