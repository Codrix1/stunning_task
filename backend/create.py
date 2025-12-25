from datetime import datetime
from dotenv import load_dotenv

from services.mongodb_service import MongoDBService
from auth.jwt_utils import JWTUtils
from schema.mondb_schema import UserSchema

load_dotenv()

def create_admin_user():
    mongo = MongoDBService()

    # Check if admin already exists
    existing_user = mongo.get_user_by_username("admin")
    if existing_user:
        print("✅ Admin user already exists")
        return

    # Hash password
    hashed_password = JWTUtils.hash_password("admin")

    # Create user schema
    admin_user = UserSchema(
        username="admin",
        password=hashed_password,
        created_at=datetime.utcnow(),
        is_active=True,
        role="admin"  # optional but recommended
    )

    user = mongo.create_user(admin_user)

    print("✅ Admin user created successfully")
    print(f"User ID: {user.id}")
    print(f"Username: {user.username}")

if __name__ == "__main__":
    create_admin_user()
