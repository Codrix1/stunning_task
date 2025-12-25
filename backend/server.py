from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from services.mongodb_service import MongoDBService
from routes.chat_router import ChatRouter
from auth.middleware import AuthenticationMiddleware

load_dotenv()

# Environment configuration
DEBUG = os.getenv("DEBUG", "true").lower() == "true"
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# Initialize services
mongo_service = MongoDBService()

# Initialize FastAPI app
app = FastAPI(
    title="Chat API",
    version="1.0.0",
    description="FastAPI backend for LLM chat with MongoDB",
    docs_url="/docs" if DEBUG else None,
    redoc_url="/redoc" if DEBUG else None,
)

# CORS configuration for development
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:8080",
]

# Add CORS middleware (must be added before other middleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Add authentication middleware
app.add_middleware(
    AuthenticationMiddleware,
    excluded_paths=[
        "/docs",
        "/openapi.json",
        "/redoc",
        "/api/login",
        "/health",
    ],
    mongo_service=mongo_service
)

# Initialize and include router
chat_router = ChatRouter(mongo_service=mongo_service)
app.include_router(chat_router.router)


@app.get("/")
async def root():
    return {"message": "Chat API is running", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy", "debug": DEBUG}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host=HOST,
        port=PORT,
        reload=DEBUG,
        log_level="debug" if DEBUG else "info"
    )
