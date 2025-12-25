"""
Example usage of MongoDB service with LangChain integration
"""
import os
import sys
from datetime import datetime
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.mongodb_service import MongoDBService
from schema.mondb_schema import UserSchema, ChatSchema

# Load environment variables
load_dotenv()

def main():
    # Initialize the service
    mongo_service = MongoDBService()
    
    # Create a new user
    user_data = UserSchema(
        username="john_doe",
        password="hashed_password_here",
        created_at=datetime.utcnow()
    )
    user = mongo_service.create_user(user_data)
    print(f"Created user: {user.username} with ID: {user.id}")
    
    # Create a new chat
    chat_data = ChatSchema(
        user_id=user.id,
        last_updated=datetime.utcnow(),
        messages=[]
    )
    chat = mongo_service.create_chat(chat_data)
    print(f"Created chat with ID: {chat.id}")
    
    # Add messages to the chat using LangChain integration
    print("\nAdding messages to chat...")
    
    # Add user message
    user_message = HumanMessage(content="Hello, how are you?")
    mongo_service.add_message_to_chat(user.id, chat.id, user_message)
    
    # Add AI response
    ai_message = AIMessage(content="I am doing well, thanks for asking!")
    mongo_service.add_message_to_chat(user.id, chat.id, ai_message)
    
    # Add another exchange
    user_message2 = HumanMessage(content="Can you help me with Python?")
    mongo_service.add_message_to_chat(user.id, chat.id, user_message2)
    
    ai_message2 = AIMessage(content="Of course! I'd be happy to help you with Python. What specific topic would you like to learn about?")
    mongo_service.add_message_to_chat(user.id, chat.id, ai_message2)
    
    # Get LangChain chat history directly
    history = mongo_service.get_chat_history(user.id, chat.id)
    print(f"\nMessages from LangChain history for session '{user.id}_{chat.id}':")
    for message in history.messages:
        print(f"- {message.type.capitalize()}: {message.content}")
    
    # Get chat from our model
    updated_chat = mongo_service.get_chat(chat.id)
    print(f"\nMessages from our Chat model:")
    for message in updated_chat.messages:
        print(f"- {message.type.capitalize()}: {message.content}")
    
    # Get all chats for the user
    user_chats = mongo_service.get_user_chats(user.id)
    print(f"\nUser has {len(user_chats)} chat(s)")
    
    # Sync chat with LangChain (useful for data consistency)
    mongo_service.sync_chat_with_langchain(user.id, chat.id)
    print("Chat synced with LangChain history")

if __name__ == "__main__":
    main()
