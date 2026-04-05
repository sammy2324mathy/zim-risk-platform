from __future__ import annotations

"""
ZIM RISK PLATFORM - Enterprise Data Models
------------------------------------------
Core schema for IFRS 9 ECL calculations, Stress Testing, and Fraud Monitor.
Multi-tenant architecture with RBAC (Role-Based Access Control).
"""

from sqlalchemy import Column, Float, Integer, String, Text, ForeignKey, Index, text, Boolean, Table
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()

# --- RBAC & Tenant Structure ---

# Association Table for Many-to-Many Role-Permission
role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", String(50), ForeignKey("roles.id"), primary_key=True),
    Column("permission_id", String(100), ForeignKey("permissions.id"), primary_key=True),
)

# Association Table for Many-to-Many User-Role
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("role_id", String(50), ForeignKey("roles.id"), primary_key=True),
)

class Tenant(Base):
    __tablename__ = "tenants"
    tenant_id = Column(String(50), primary_key=True) # e.g., "CABS", "ECOBANK", "RBZ"
    name = Column(String(255), nullable=False)
    registration_no = Column(String(50), nullable=True)
    is_regulator = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(String(50), server_default=func.current_timestamp())
    updated_at = Column(Text, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    tenant_id = Column(String(50), ForeignKey("tenants.tenant_id"), nullable=False, index=True)
    is_active = Column(Boolean, default=True)
    mfa_enabled = Column(Boolean, default=False)
    created_at = Column(String(50), server_default=func.current_timestamp())
    updated_at = Column(Text, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relationships
    roles = relationship("Role", secondary=user_roles, back_populates="users")

class Role(Base):
    __tablename__ = "roles"
    id = Column(String(50), primary_key=True) # e.g., "admin", "risk_manager", "compliance", "regulator"
    name = Column(String(100), nullable=False)
    description = Column(Text)
    
    # Relationships
    permissions = relationship("Permission", secondary=role_permissions, back_populates="roles")
    users = relationship("User", secondary=user_roles, back_populates="roles")

class Permission(Base):
    __tablename__ = "permissions"
    id = Column(String(100), primary_key=True) # e.g., "risk.ecl.execute", "fraud.str.create"
    description = Column(Text)
    
    # Relationships
    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")

# --- Core Risk, Fraud & Compliance Entities ---

class Loan(Base):
    __tablename__ = "loans"
    loan_id = Column(String(50), primary_key=True)
    tenant_id = Column(String(50), ForeignKey("tenants.tenant_id"), nullable=False, index=True)
    customer_name = Column(String(255), nullable=False, index=True)
    sector = Column(String(100), nullable=False, index=True)
    currency = Column(String(10), nullable=False) # ZiG, USD, ZWL
    product_type = Column(String(100), nullable=False)
    days_past_due = Column(Integer, nullable=False, default=0)
    outstanding_principal = Column(Float, nullable=False)
    committed_limit = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    collateral_value = Column(Float, nullable=False)
    collateral_type = Column(String(100), nullable=False)
    expected_recovery_cost = Column(Float, nullable=False, default=0.0)
    tenor_months = Column(Integer, nullable=False)
    branch_code = Column(String(50), nullable=False, index=True)
    watchlist = Column(Integer, nullable=False, default=0)
    connected_party_group = Column(String(255), nullable=True, index=True)
    created_at = Column(String(50), server_default=func.current_timestamp())
    updated_at = Column(Text, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

class ECLResult(Base):
    __tablename__ = "ecl_results"
    id = Column(Integer, primary_key=True, autoincrement=True)
    loan_id = Column(String(50), ForeignKey("loans.loan_id"), nullable=False, index=True)
    tenant_id = Column(String(50), ForeignKey("tenants.tenant_id"), nullable=False, index=True)
    probability_of_default = Column(Float, nullable=False)
    loss_given_default = Column(Float, nullable=False)
    exposure_at_default = Column(Float, nullable=False)
    stage = Column(Integer, nullable=False) # 1, 2, or 3
    total_ecl = Column(Float, nullable=False)
    calculated_at = Column(String(50), server_default=func.current_timestamp())

class FraudAlert(Base):
    __tablename__ = "fraud_alerts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(String(50), ForeignKey("tenants.tenant_id"), nullable=False, index=True)
    entity_id = Column(String(50), nullable=False, index=True) # Loan ID or Customer Group
    alert_type = Column(String(100), nullable=False) # e.g., "Circular Lending", "High Exposure (>15%)"
    severity = Column(String(20), nullable=False) # High, Medium, Low
    status = Column(String(50), default="Pending") # Pending, Investigating, Closed, STR_Generated
    details = Column(Text)
    created_at = Column(String(50), server_default=func.current_timestamp())

class MacroScenario(Base):
    __tablename__ = "macro_scenarios"
    scenario_id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    zig_usd_rate = Column(Float, nullable=False)
    usd_funding_gap = Column(Float, nullable=False)
    inflation_rate = Column(Float, nullable=False)
    agricultural_output_index = Column(Float, nullable=False)
    gdp_growth = Column(Float, nullable=False)
    unemployment_rate = Column(Float, nullable=False)
    severity = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(String(50), server_default=func.current_timestamp())
    updated_at = Column(Text, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

class StressScenario(Base):
    __tablename__ = "stress_scenarios"
    scenario_id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    fx_shock = Column(Float, nullable=False)
    inflation_shock = Column(Float, nullable=False)
    default_shock = Column(Float, nullable=False)
    liquidity_shock = Column(Float, nullable=False)
    correlation_bias = Column(Float, nullable=False)
    created_at = Column(String(50), server_default=func.current_timestamp())
    updated_at = Column(Text, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

class StressRun(Base):
    __tablename__ = "stress_runs"
    run_id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(String(50), ForeignKey("tenants.tenant_id"), nullable=False, index=True)
    scenario_id = Column(String(50), ForeignKey("stress_scenarios.scenario_id"), nullable=False)
    scenario_name = Column(String(255), nullable=False)
    macro_scenario_id = Column(String(50), ForeignKey("macro_scenarios.scenario_id"), nullable=False)
    paths = Column(Integer, nullable=False) # Monte Carlo path count
    expected_loss = Column(Float, nullable=False)
    mean_capital_ratio = Column(Float, nullable=False)
    percentile_5 = Column(Float, nullable=False)
    percentile_50 = Column(Float, nullable=False)
    percentile_95 = Column(Float, nullable=False)
    breach_probability = Column(Float, nullable=False)
    distribution = Column(Text, nullable=False) # JSON distribution of outcomes
    created_at = Column(String(50), server_default=func.current_timestamp())
    __table_args__ = (Index('idx_stress_runs_tenant_created', 'tenant_id', text('created_at DESC')),)

class RegulatoryUpdate(Base):
    __tablename__ = "regulatory_updates"
    update_id = Column(String(50), primary_key=True)
    source = Column(String(100), nullable=False, index=True) # e.g., "RBZ", "Gazette"
    title = Column(String(255), nullable=False)
    published_on = Column(String(50), nullable=False)
    effective_on = Column(String(50), nullable=False)
    theme = Column(String(100), nullable=False, index=True) # e.g., "Capital Adequacy", "AML"
    severity = Column(String(20), nullable=False)
    summary = Column(Text, nullable=False)
    extracted_rules = Column(Text, nullable=False) # NLP parsed rules
    created_at = Column(String(50), server_default=func.current_timestamp())

class FXRate(Base):
    __tablename__ = "fx_rates"
    rate_id = Column(Integer, primary_key=True, autoincrement=True)
    pair = Column(String(20), nullable=False, index=True) # e.g., "ZiG/USD"
    source = Column(String(100), nullable=False)
    rate = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    captured_at = Column(String(50), nullable=False)
    created_at = Column(String(50), server_default=func.current_timestamp())
    __table_args__ = (Index('idx_fx_rates_captured', 'pair', text('captured_at DESC')),)
