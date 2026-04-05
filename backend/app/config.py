import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    # SUPABASE / POSTGRES CONFIGURATION (CLOUD ONLY)
    # Expected Format: postgresql://postgres.[USER]:[PASSWORD]@[HOST]:5432/postgres
    DATABASE_URL = os.getenv("DATABASE_URL")

    def __init__(self):
        # SQLAlchemy requires 'postgresql://' as the protocol prefix
        if self.DATABASE_URL and self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)

        if not self.DATABASE_URL:
            # Default to local SQLite for development
            self.DATABASE_URL = "sqlite:///./risk_platform.db"

settings = Settings()