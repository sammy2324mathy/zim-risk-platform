from __future__ import annotations

import logging
from sqlalchemy.orm import Session
from app.database import Database
from app.models import (
    Loan, MacroScenario, StressScenario, FXRate, RegulatoryUpdate, 
    Tenant, User, Role, Permission, role_permissions, user_roles
)
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_data():
    Database.initialize(settings.DATABASE_URL)
    
    with next(Database.get_db()) as db:
        # 1. Tenants (Adding Ecocash for specialized hierarchy)
        logger.info("Seeding Institutional Tenants...")
        t_cabs = Tenant(tenant_id="CABS", name="Central African Building Society")
        t_rbz = Tenant(tenant_id="RBZ", name="Reserve Bank of Zimbabwe", is_regulator=True)
        t_eco = Tenant(tenant_id="ECOBANK", name="Ecobank Zimbabwe Limited")
        t_ecocash = Tenant(tenant_id="ECOCASH", name="EcoCash Holdings Zimbabwe")
        db.add_all([t_cabs, t_rbz, t_eco, t_ecocash])

        # 2. Permissions
        logger.info("Seeding Permission Matrix...")
        p_view = Permission(id="view.dashboard", description="View institutional dashboard")
        p_ecl = Permission(id="risk.ecl.execute", description="Calculate IFRS 9 ECL")
        p_stress = Permission(id="risk.stress.execute", description="Run Monte Carlo Stress Tests")
        p_fraud = Permission(id="fraud.str.submit", description="Submit Suspicious Transaction Reports")
        p_users = Permission(id="tenant.admin.manage", description="Manage institutional users")
        db.add_all([p_view, p_ecl, p_stress, p_fraud, p_users])

        # 3. Roles (Hierarchical)
        r_admin = Role(id="admin", name="Institutional Administrator")
        r_admin.permissions.extend([p_view, p_ecl, p_stress, p_fraud, p_users])
        
        r_analyst = Role(id="analyst", name="Risk Analyst")
        r_analyst.permissions.extend([p_view, p_ecl, p_stress])
        
        r_compliance = Role(id="compliance", name="Compliance Officer")
        r_compliance.permissions.extend([p_view, p_fraud])

        db.add_all([r_admin, r_analyst, r_compliance])

        # 4. Users (Hierarchical Collaboration per Tenant)
        logger.info("Seeding Collaborative Personas...")

        # --- ECOCASH HIERARCHY ---
        u_ecocash_admin = User(username="admin_ecocash", email="governance@ecocash.co.zw", hashed_password="hashed_zimrisk123", tenant_id="ECOCASH")
        u_ecocash_admin.roles.append(r_admin)
        
        u_ecocash_analyst = User(username="analyst_ecocash", email="risk_desk@ecocash.co.zw", hashed_password="hashed_zimrisk123", tenant_id="ECOCASH")
        u_ecocash_analyst.roles.append(r_analyst)

        # --- CABS HIERARCHY ---
        u_cabs_admin = User(username="admin_cabs", email="admin@cabs.co.zw", hashed_password="hashed_zimrisk123", tenant_id="CABS")
        u_cabs_admin.roles.append(r_admin)

        # --- RBZ SUPERVISORY HIERARCHY ---
        u_rbz_supervisor = User(username="supervisor_rbz", email="governor_desk@rbz.co.zw", hashed_password="hashed_zimrisk123", tenant_id="RBZ")
        u_rbz_supervisor.roles.append(r_admin)

        db.add_all([u_ecocash_admin, u_ecocash_analyst, u_cabs_admin, u_rbz_supervisor])

        # 5. Core Data Artifacts
        db.add(MacroScenario(
            scenario_id="baseline", 
            name="Q2 Baseline 2026", 
            description="Baseline for 2026 Q2 economic trajectory",
            zig_usd_rate=13.5, 
            usd_funding_gap=0.15,
            inflation_rate=0.18, 
            agricultural_output_index=1.02, 
            gdp_growth=0.035, 
            unemployment_rate=0.08,
            severity=0.2,
            confidence=0.95
        ))
        
        db.add(StressScenario(
            scenario_id="zig_shock",
            name="ZiG Devaluation (40%)",
            description="Aggressive currency reset scenario with 40% devaluation.",
            fx_shock=0.4, inflation_shock=0.2, default_shock=0.15, liquidity_shock=0.1, correlation_bias=0.5
        ))
        db.add(StressScenario(
            scenario_id="liquidity_drift",
            name="Liquidity Squeeze",
            description="Systemic USD funding gap expansion.",
            fx_shock=0.1, inflation_shock=0.05, default_shock=0.05, liquidity_shock=0.4, correlation_bias=0.2
        ))

        # Seed Diversified Portfolios
        sectors = ["Agriculture", "Mining", "Manufacturing", "FinTech", "Retail"]
        for t_id in ["CABS", "ECOBANK", "ECOCASH"]:
            for i in range(15):
                db.add(Loan(
                    loan_id=f"{t_id}-ART-{i:03d}",
                    tenant_id=t_id,
                    customer_name=f"Corporate_Entity_{chr(65 + i)}",
                    sector=sectors[i % len(sectors)],
                    currency="USD" if i % 3 == 0 else "ZiG",
                    product_type="Facility_Alpha",
                    days_past_due=0,
                    outstanding_principal=5000000 + (i * 50000),
                    committed_limit=6000000,
                    interest_rate=0.12,
                    collateral_value=7000000,
                    collateral_type="Assets",
                    tenor_months=24,
                    branch_code="CENTRAL-HARARE-001"
                ))
        
        db.commit()
    logger.info("Deep-Tenant Hierarchical seed complete.")

if __name__ == "__main__":
    seed_data()
