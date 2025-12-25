# Chat API Backend

A FastAPI backend for LLM chat application with MongoDB integration and JWT authentication.

## Features

- **FastAPI** web framework with automatic API documentation
- **MongoDB** integration for user management and chat history
- **JWT Authentication** with bcrypt password hashing
- **Google Gemini AI** integration via LangChain
- **CORS** enabled for frontend integration

## Prerequisites

- Python 3.11 or higher
- MongoDB Atlas account (or local MongoDB instance)
- Google API key for Gemini AI

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Variables

Create a `.env` file in the backend directory with the following variables:
well be sent via linkedin 

### 5. Run the Server

```bash
python server.py
```

The server will start on `http://localhost:8000`

### 6. Access the Application

- **Backend API Documentation**: `http://localhost:8000/docs`
- **Frontend Application**: https://stunning-task-eight.vercel.app/

## API Endpoints

- `GET /` - Health check
- `POST /api/login` - User authentication
- `GET /api/chats` - Get user chat history
- `POST /api/chat` - Send message to LLM
- `POST /api/chats/new` - Create new chat

## Project Structure

```
backend/
├── auth/                 # Authentication utilities
│   ├── jwt_utils.py     # JWT token management
│   └── middleware.py    # Auth middleware
├── models/              # Pydantic models
├── routes/              # API route handlers
├── schema/              # Request/response schemas
├── services/            # Business logic services
├── testing/             # Test files
├── server.py           # Main application entry point
├── requirements.txt    # Python dependencies
└── vercel.json        # Vercel deployment config
```

## Development

- The server runs in debug mode by default with auto-reload enabled
- API documentation is available at `/docs` when `DEBUG=true`
- CORS is configured to allow requests from common development ports

## Deployment

This backend is configured for deployment on Vercel. See `vercel.json` for deployment configuration.

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Gemini AI API key | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET_KEY` | Secret key for JWT token signing | Yes |
| `DEBUG` | Enable debug mode (default: true) | No |
| `HOST` | Server host (default: 0.0.0.0) | No |
| `PORT` | Server port (default: 8000) | No |
