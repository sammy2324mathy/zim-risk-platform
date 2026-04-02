from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router
from app.config import settings
from app.database import Database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the database singleton
    Database.initialize(settings.DATABASE_URL)
    yield

def create_app() -> FastAPI:
    """
    Simpler FastAPI application factory for flattened architecture.
    """
    app = FastAPI(
        title="Zim Risk Platform",
        summary="Flat Architecture Version",
        version="1.2.0-simple",
        lifespan=lifespan
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # All routes are now in a singular api.py
    app.include_router(router, prefix="/api/v1")

    return app

app = create_app()
