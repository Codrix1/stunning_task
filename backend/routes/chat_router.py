"""
Chat Router - Handles authentication, chat history, and LLM interactions
"""
from fastapi import APIRouter, Request, HTTPException, status
from datetime import datetime
from langchain_core.messages import HumanMessage, AIMessage
from langchain_google_genai import GoogleGenerativeAI
import os
from dotenv import load_dotenv

from services.mongodb_service import MongoDBService
from schema.mondb_schema import ChatSchema
from schema.chat_schema import (
    LoginRequest, TokenResponse, MessageRequest, MessageResponse,
    ChatResponse, ChatsResponse, LLMRequest, LLMResponse, CreateChatResponse
)
from auth.jwt_utils import JWTUtils
from auth.middleware import get_current_user_id

load_dotenv()


class ChatRouter:
    """Class-based router for chat operations"""
    
    def __init__(self, mongo_service: MongoDBService = None):
        self.router = APIRouter(prefix="/api", tags=["chat"])
        self.mongo_service = mongo_service or MongoDBService()
        self.llm = GoogleGenerativeAI(model="gemini-2.5-flash")
        self._register_routes()
    
    def _register_routes(self):
        """Register all routes"""
        self.router.post("/login", response_model=TokenResponse)(self.login)
        self.router.get("/chats", response_model=ChatsResponse)(self.get_user_chats)
        self.router.get("/chats/{chat_id}/messages")(self.get_chat_messages)
        self.router.post("/chat", response_model=LLMResponse)(self.talk_with_llm)
        self.router.post("/chats/new", response_model=CreateChatResponse)(self.create_new_chat)
    
    async def login(self, request: LoginRequest):
        """Authenticate user and return JWT token."""
        user = self.mongo_service.get_user_by_username(request.username)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        if not JWTUtils.verify_password(request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        access_token = JWTUtils.create_user_token(user.id, user.username)
        return TokenResponse(access_token=access_token)
    
    async def get_user_chats(self, request: Request):
        """Get all chat histories for the authenticated user."""
        user_id = get_current_user_id(request)
        chats = self.mongo_service.get_user_chats(user_id)
        
        def get_chat_title(chat):
            """Extract first human message as title, or return default"""
            for message in chat.messages:
                if message.type == "human":
                    # Truncate long messages for title display
                    content = message.content.strip()
                    return content[:50] + "..." if len(content) > 50 else content
            return "New Chat"
        
        return ChatsResponse(
            user_id=user_id,
            chat_count=len(chats),
            chats=[
                ChatResponse(
                    id=chat.id,
                    last_updated=chat.last_updated,
                    message_count=len(chat.messages),
                    title=get_chat_title(chat)
                )
                for chat in chats
            ]
        )
    
    async def get_chat_messages(self, request: Request, chat_id: str):
        """Get all messages from a specific chat."""
        user_id = get_current_user_id(request)
        chat = self.mongo_service.get_chat(chat_id)
        
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found"
            )
        
        if chat.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        return {
            "chat_id": chat_id,
            "messages": [
                {"type": msg.type, "content": msg.content}
                for msg in chat.messages
            ]
        }
    
    async def talk_with_llm(self, request: Request, llm_request: LLMRequest):
        """Send a message to the LLM and get a response."""
        user_id = get_current_user_id(request)
        
        if llm_request.chat_id:
            chat = self.mongo_service.get_chat(llm_request.chat_id)
            if not chat:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Chat not found"
                )
            if chat.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied"
                )
            chat_id = llm_request.chat_id
        else:
            chat_data = ChatSchema(
                user_id=user_id,
                last_updated=datetime.utcnow(),
                messages=[]
            )
            chat = self.mongo_service.create_chat(chat_data)
            chat_id = chat.id
        
        # Add user message to chat
        user_message = HumanMessage(content=llm_request.message)
        self.mongo_service.add_message_to_chat(user_id, chat_id, user_message)
        
        # Reload chat to get all messages including system prompt
        chat = self.mongo_service.get_chat(chat_id)  
        
        try:
            response = self.llm.invoke(chat.messages)
        except Exception as e:
            print(f"❌ LLM invocation error: {e}")
            response = "Api key quota is finished please wait for the limit to reset"

          
        # Save AI response
        ai_message = AIMessage(content=response)
        self.mongo_service.add_message_to_chat(user_id, chat_id, ai_message)
        
        return LLMResponse(
            chat_id=chat_id,
            user_message=llm_request.message,
            llm_response=response
        )
    
    async def create_new_chat(self, request: Request):
        """Create a new empty chat for the authenticated user."""
        user_id = get_current_user_id(request)
        
        chat_data = ChatSchema(
            user_id=user_id,
            last_updated=datetime.utcnow(),
            messages=[]
        )
        chat = self.mongo_service.create_chat(chat_data)
        
        return CreateChatResponse(
            message="Chat created successfully",
            chat_id=chat.id
        )
