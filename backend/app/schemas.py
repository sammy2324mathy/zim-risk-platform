from __future__ import annotations

from pydantic import BaseModel
from typing import Optional, List

class LoanPayload(BaseModel):
    loan_id: str
    tenant_id: str
    customer_name: str
    sector: str
    currency: str
    product_type: str
    outstanding_principal: float
    committed_limit: float
    interest_rate: float
    collateral_value: float
    collateral_type: str
    days_past_due: int = 0
    watchlist: int = 0
    connected_party_group: Optional[str] = None

class MacroScenarioPayload(BaseModel):
    scenario_id: str
    name: str
    description: str
    zig_usd_rate: float
    inflation_rate: float
    gdp_growth: float
    severity: float

class StressScenarioPayload(BaseModel):
    scenario_id: str
    name: str
    description: str
    fx_shock: float
    inflation_shock: float
    default_shock: float

class StressRunRequest(BaseModel):
    scenario_id: str
    macro_scenario_id: str = "baseline"
    paths: int = 2000
    persist: bool = True

class RegulatoryUpdatePayload(BaseModel):
    update_id: str
    source: str
    title: str
    published_on: str
    effective_on: str
    theme: str
    severity: str
    summary: str

class LoginPayload(BaseModel):
    username: str
    password: str
