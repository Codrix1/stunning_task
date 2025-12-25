"""
FastAPI Authentication Middleware
"""
from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from typing import List, Optional, Callable

from auth.jwt_utils import JWTUtils


class AuthenticationMiddleware(BaseHTTPMiddleware):
    """
    Middleware that authenticates requests using JWT tokens.
    Attaches user information to request state for protected routes.
    """
    
    def __init__(
        self,
        app,
        excluded_paths: Optional[List[str]] = None,
        mongo_service = None
    ):
        super().__init__(app)
        self.excluded_paths = excluded_paths or ["/", "/docs", "/openapi.json", "/redoc"]
        self.mongo_service = mongo_service
    
    async def dispatch(self, request: Request, call_next: Callable):
        path = request.url.path
        
        # Always allow OPTIONS requests (CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)
        
        # Skip authentication for excluded paths
        if self._is_excluded_path(path):
            return await call_next(request)
        
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            return self._unauthorized_response("Missing Authorization header")
        
        # Validate Bearer token format
        if not auth_header.startswith("Bearer "):
            return self._unauthorized_response("Invalid Authorization header format. Use 'Bearer <token>'")
        
        token = auth_header.replace("Bearer ", "")
        
        # Validate token
        payload = JWTUtils.verify_token(token)
        
        if not payload:
            return self._unauthorized_response("Invalid or expired token")
        
        # Attach user info to request state
        request.state.user_id = payload.get("user_id")
        request.state.username = payload.get("username")
        request.state.token_payload = payload
        request.state.is_authenticated = True
        
        # Continue to the next middleware/route
        response = await call_next(request)
        return response
    
    def _unauthorized_response(self, detail: str) -> JSONResponse:
        """Create unauthorized response with CORS headers"""
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "error": "Unauthorized",
                "detail": detail
            },
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )
    
    def _is_excluded_path(self, path: str) -> bool:
        """Check if the path should bypass authentication"""
        for excluded in self.excluded_paths:
            if path == excluded or path.startswith(excluded + "/"):
                return True
        return False


# FastAPI Security scheme for Swagger docs
security_scheme = HTTPBearer(auto_error=False)


def get_current_user(request: Request) -> dict:
    """
    Dependency to get current authenticated user from request state.
    Use this in route handlers to access user information.
    """
    if not hasattr(request.state, "is_authenticated") or not request.state.is_authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    return {
        "user_id": request.state.user_id,
        "username": request.state.username,
        "token_payload": request.state.token_payload
    }


def get_current_user_id(request: Request) -> str:
    """
    Dependency to get just the user_id from request state.
    """
    user = get_current_user(request)
    return user["user_id"]


async def require_auth(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme)
) -> bool:
    """
    Dependency for routes that require authentication.
    Can be used with Depends() for explicit auth requirement in route definition.
    """
    if not hasattr(request.state, "is_authenticated") or not request.state.is_authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return True


def create_auth_dependency(mongo_service=None):
    """
    Factory function to create an auth dependency with access to mongo_service.
    Useful for validating user exists in database.
    """
    async def auth_dependency(request: Request) -> dict:
        user_info = get_current_user(request)
        
        if mongo_service:
            user = mongo_service.get_user(user_info["user_id"])
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found"
                )
        
        return user_info
    
    return auth_dependency
