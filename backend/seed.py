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
        # --- CLEANUP PREVIOUS MIGRATION ATTEMPTS ---
        logger.info("Sanitizing Enterprise Vault...")
        try:
            db.query(Loan).delete()
            db.query(User).delete()
            db.query(Role).delete()
            db.query(Permission).delete()
            db.query(Tenant).delete()
            db.commit()
        except:
            db.rollback()
            
        # 1. Tenants (Adding Ecocash for specialized hierarchy)
        logger.info("Seeding Institutional Tenants...")
        t_cabs = Tenant(tenant_id="CABS", name="Central African Building Society")
        t_rbz = Tenant(tenant_id="RBZ", name="Reserve Bank of Zimbabwe", is_regulator=True)
        t_eco = Tenant(tenant_id="ECOBANK", name="Ecobank Zimbabwe Limited")
        t_ecocash = Tenant(tenant_id="ECOCASH", name="EcoCash Holdings Zimbabwe")
        db.add_all([t_cabs, t_rbz, t_eco, t_ecocash])
        db.commit()

        # 2. Permissions
        logger.info("Seeding Permission Matrix...")
        p_view = Permission(id="view.dashboard", description="View institutional dashboard")
        p_ecl = Permission(id="risk.ecl.execute", description="Calculate IFRS 9 ECL")
        p_calc = Permission(id="risk.ecl.override", description="IFRS 9 Stage Override")
        p_stress = Permission(id="risk.stress.mc", description="Run Monte Carlo Stress Lab")
        p_fraud = Permission(id="risk.fraud.monitor", description="Access Fraud Intelligence Hub")
        p_audit = Permission(id="compliance.audit", description="Generate Regulatory XML")
        p_admin = Permission(id="system.admin", description="Full System Administration")
        db.add_all([p_view, p_ecl, p_calc, p_stress, p_fraud, p_audit, p_admin])

        # 3. Roles
        logger.info("Defining Hierarchy Roles...")
        r_admin = Role(id="admin", name="Tenant Administrator")
        r_analyst = Role(id="analyst", name="Risk Specialist")
        r_compliance = Role(id="compliance", name="Compliance Officer")
        r_auditor = Role(id="auditor", name="External Auditor")

        r_admin.permissions.extend([p_view, p_ecl, p_calc, p_stress, p_fraud, p_audit, p_admin])
        r_analyst.permissions.extend([p_view, p_ecl, p_stress, p_fraud])
        r_compliance.permissions.extend([p_view, p_fraud, p_audit])
        r_auditor.permissions.extend([p_view, p_audit])
        db.add_all([r_admin, r_analyst, r_compliance, r_auditor])

        # 4. Users (Simulating multi-tenant personas)
        logger.info("Establishing Persona Identities...")
        u_ecocash_admin = User(username="admin_ecocash", email="governance@ecocash.co.zw", hashed_password="hashed_zimrisk123", tenant_id="ECOCASH")
        u_ecocash_admin.roles.append(r_admin)
        
        u_ecocash_analyst = User(username="analyst_ecocash", email="risk_desk@ecocash.co.zw", hashed_password="hashed_zimrisk123", tenant_id="ECOCASH")
        u_ecocash_analyst.roles.append(r_analyst)

        # CABS HIERARCHY
        u_cabs_admin = User(username="admin_cabs", email="admin@cabs.co.zw", hashed_password="hashed_zimrisk123", tenant_id="CABS")
        u_cabs_admin.roles.append(r_admin)

        # RBZ SUPERVISORY HIERARCHY
        u_rbz_supervisor = User(username="supervisor_rbz", email="governor_desk@rbz.co.zw", hashed_password="hashed_zimrisk123", tenant_id="RBZ")
        u_rbz_supervisor.roles.append(r_admin)
        db.add_all([u_ecocash_admin, u_ecocash_analyst, u_cabs_admin, u_rbz_supervisor])

        # 5. Macro & Stress Scenarios
        logger.info("Calibrating Simulation Scenarios...")
        macro_base = MacroScenario(
            scenario_id="zim_base_2026",
            name="Zimbabwe Baseline Q2",
            description="Moderate growth with stable ZiG currency drift.",
            zig_usd_rate=13.5, usd_funding_gap=0.08, inflation_rate=0.05,
            agricultural_output_index=1.0, gdp_growth=0.03, unemployment_rate=0.15,
            severity=0.0, confidence=0.95
        )
        macro_zig_shock = MacroScenario(
            scenario_id="zig_devalue_shock",
            name="ZiG Volatility Event",
            description="Sudden 40% devaluation against USD.",
            zig_usd_rate=19.5, usd_funding_gap=0.15, inflation_rate=0.25,
            agricultural_output_index=0.8, gdp_growth=-0.02, unemployment_rate=0.18,
            severity=0.8, confidence=0.70
        )
        db.add_all([macro_base, macro_zig_shock])

        stress_zig = StressScenario(
            scenario_id="zig_shock",
            name="Currency Volatility Shock",
            description="High ZiG/USD fluctuation impact on Tier 1 capital.",
            fx_shock=0.4, inflation_shock=0.2, default_shock=0.1, liquidity_shock=0.15, correlation_bias=0.3
        )
        stress_liq = StressScenario(
            scenario_id="liquidity_drift",
            name="Liquidity Squeeze",
            description="Systemic USD funding gap expansion.",
            fx_shock=0.1, inflation_shock=0.05, default_shock=0.05, liquidity_shock=0.4, correlation_bias=0.2
        )
        db.add_all([stress_zig, stress_liq])

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
