from __future__ import annotations

from pydantic import BaseModel, Field

# --- ECL & Portfolio Schemas ---

class FXRatePayload(BaseModel):
    pair: str = Field(min_length=6, max_length=10)
    source: str = Field(min_length=2, max_length=50)
    rate: float = Field(gt=0, le=1000000)
    confidence: float = Field(ge=0, le=1)
    captured_at: str

class MacroScenarioPayload(BaseModel):
    scenario_id: str = Field(min_length=3, max_length=50)
    name: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=10, max_length=500)
    zig_usd_rate: float = Field(gt=0)
    usd_funding_gap: float = Field(ge=0)
    inflation_rate: float = Field(ge=0)
    agricultural_output_index: float = Field(ge=0)
    gdp_growth: float
    unemployment_rate: float = Field(ge=0)
    severity: float = Field(ge=0, le=1)
    confidence: float = Field(ge=0, le=1)

class LoanPayload(BaseModel):
    loan_id: str = Field(min_length=3, max_length=50)
    customer_name: str = Field(min_length=2, max_length=120)
    sector: str = Field(min_length=2, max_length=50)
    currency: str = Field(min_length=3, max_length=10)
    product_type: str = Field(min_length=2, max_length=50)
    days_past_due: int = Field(ge=0)
    outstanding_principal: float = Field(ge=0)
    committed_limit: float = Field(ge=0)
    interest_rate: float = Field(ge=0)
    collateral_value: float = Field(ge=0)
    collateral_type: str = Field(min_length=2, max_length=50)
    expected_recovery_cost: float = Field(ge=0)
    tenor_months: int = Field(gt=0)
    branch_code: str = Field(min_length=2, max_length=20)
    watchlist: int = Field(ge=0, le=2)
    connected_party_group: str = Field(min_length=2, max_length=100)

# --- Stress Testing Schemas ---

class StressScenarioPayload(BaseModel):
    scenario_id: str = Field(min_length=3, max_length=50)
    name: str = Field(min_length=2, max_length=120)
    description: str = Field(min_length=10, max_length=500)
    fx_shock: float = Field(ge=0, le=2)
    inflation_shock: float = Field(ge=0, le=2)
    default_shock: float = Field(ge=0, le=2)
    liquidity_shock: float = Field(ge=0, le=2)
    correlation_bias: float = Field(ge=0, le=2)

class StressRunRequest(BaseModel):
    scenario_id: str | None = Field(default=None)
    macro_scenario_id: str = Field(default="baseline")
    paths: int = Field(default=2000, ge=200, le=10000)
    persist: bool = Field(default=True)

# --- Compliance Schemas ---

class RegulatoryUpdatePayload(BaseModel):
    update_id: str = Field(min_length=3, max_length=50)
    source: str = Field(min_length=2, max_length=120)
    title: str = Field(min_length=5, max_length=200)
    published_on: str
    effective_on: str
    theme: str = Field(min_length=2, max_length=100)
    severity: str = Field(pattern='^(low|medium|high|critical)$')
    summary: str = Field(min_length=20, max_length=1000)
    extracted_rules: str = Field(description="JSON-encoded rule dictionary")
