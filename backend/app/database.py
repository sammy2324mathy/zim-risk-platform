from __future__ import annotations

import logging
from contextlib import contextmanager
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.models import Base

logger = logging.getLogger(__name__)

class Database:
    """
    Simpler database engine for flattened project structure.
    """
    _engine = None
    _SessionLocal = None

    @classmethod
    def get_engine(cls, url: str):
        if cls._engine is None:
            if url.startswith("sqlite"):
                import os
                db_path = url.replace("sqlite:///", "")
                os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
            
            cls._engine = create_engine(
                url, 
                connect_args={"check_same_thread": False} if url.startswith("sqlite") else {},
                pool_pre_ping=True
            )
        return cls._engine

    @classmethod
    def initialize(cls, url: str):
        engine = cls.get_engine(url)
        Base.metadata.create_all(bind=engine)
        cls._SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        logger.info("Database schema initialized.")

    @classmethod
    def get_db(cls):
        """
        FastAPI dependency for database sessions.
        """
        if cls._SessionLocal is None:
            raise RuntimeError("Database not initialized. Call initialize() first.")
        db = cls._SessionLocal()
        try:
            yield db
            db.commit()
        except:
            db.rollback()
            raise
        finally:
            db.close()
