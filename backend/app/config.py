from __future__ import annotations

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Zim Risk Platform"
    VERSION: str = "1.2.0-simple"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./risk_platform.db")
    
    # Capital Adequacy Constants
    DEFAULT_CAPITAL_BASE: float = 50000000.0  # $50M Tier 1 Capital
    DEFAULT_RWA_MULTIPLIER: float = 0.65       # Standard credit RWA weight
    CAR_MINIMUM_THRESHOLD: float = 12.5       # RBZ Guideline

    class Config:
        case_sensitive = True

settings = Settings()
