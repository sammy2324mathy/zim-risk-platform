from __future__ import annotations

from sqlalchemy import Column, Float, Integer, String, Text, ForeignKey, Index, text
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Loan(Base):
    __tablename__ = "loans"
    loan_id = Column(String, primary_key=True)
    customer_name = Column(String, nullable=False, index=True)
    sector = Column(String, nullable=False, index=True)
    currency = Column(String, nullable=False)
    product_type = Column(String, nullable=False)
    days_past_due = Column(Integer, nullable=False, default=0)
    outstanding_principal = Column(Float, nullable=False)
    committed_limit = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    collateral_value = Column(Float, nullable=False)
    collateral_type = Column(String, nullable=False)
    expected_recovery_cost = Column(Float, nullable=False, default=0.0)
    tenor_months = Column(Integer, nullable=False)
    branch_code = Column(String, nullable=False, index=True)
    watchlist = Column(Integer, nullable=False, default=0)
    connected_party_group = Column(String, nullable=False, index=True)
    created_at = Column(Text, server_default=func.current_timestamp())
    updated_at = Column(Text, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

class MacroScenario(Base):
    __tablename__ = "macro_scenarios"
    scenario_id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    zig_usd_rate = Column(Float, nullable=False)
    usd_funding_gap = Column(Float, nullable=False)
    inflation_rate = Column(Float, nullable=False)
    agricultural_output_index = Column(Float, nullable=False)
    gdp_growth = Column(Float, nullable=False)
    unemployment_rate = Column(Float, nullable=False)
    severity = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(Text, server_default=func.current_timestamp())
    updated_at = Column(Text, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

class StressScenario(Base):
    __tablename__ = "stress_scenarios"
    scenario_id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    fx_shock = Column(Float, nullable=False)
    inflation_shock = Column(Float, nullable=False)
    default_shock = Column(Float, nullable=False)
    liquidity_shock = Column(Float, nullable=False)
    correlation_bias = Column(Float, nullable=False)
    created_at = Column(Text, server_default=func.current_timestamp())
    updated_at = Column(Text, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

class StressRun(Base):
    __tablename__ = "stress_runs"
    run_id = Column(Integer, primary_key=True, autoincrement=True)
    scenario_id = Column(String, ForeignKey("stress_scenarios.scenario_id"), nullable=False)
    scenario_name = Column(String, nullable=False)
    macro_scenario_id = Column(String, ForeignKey("macro_scenarios.scenario_id"), nullable=False)
    paths = Column(Integer, nullable=False)
    expected_loss = Column(Float, nullable=False)
    mean_capital_ratio = Column(Float, nullable=False)
    percentile_5 = Column(Float, nullable=False)
    percentile_50 = Column(Float, nullable=False)
    percentile_95 = Column(Float, nullable=False)
    breach_probability = Column(Float, nullable=False)
    distribution = Column(Text, nullable=False)
    created_at = Column(Text, server_default=func.current_timestamp())
    __table_args__ = (Index('idx_stress_runs_created_at', text('created_at DESC')),)

class RegulatoryUpdate(Base):
    __tablename__ = "regulatory_updates"
    update_id = Column(String, primary_key=True)
    source = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    published_on = Column(String, nullable=False)
    effective_on = Column(String, nullable=False)
    theme = Column(String, nullable=False, index=True)
    severity = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    extracted_rules = Column(Text, nullable=False)
    created_at = Column(Text, server_default=func.current_timestamp())
    updated_at = Column(Text, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

class FXRate(Base):
    __tablename__ = "fx_rates"
    rate_id = Column(Integer, primary_key=True, autoincrement=True)
    pair = Column(String, nullable=False, index=True)
    source = Column(String, nullable=False)
    rate = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    captured_at = Column(String, nullable=False)
    created_at = Column(Text, server_default=func.current_timestamp())
    __table_args__ = (Index('idx_fx_rates_pair_captured_at', 'pair', text('captured_at DESC')),)
