from __future__ import annotations

import logging
from sqlalchemy.orm import Session
from app.database import Database
from app.models import Loan, MacroScenario, StressScenario, FXRate, RegulatoryUpdate
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_data():
    Database.initialize(settings.DATABASE_URL)
    
    with next(Database.get_db()) as db:
        # 1. Macro Scenarios
        if not db.query(MacroScenario).first():
            logger.info("Seeding Macro Scenarios...")
            db.add_all([
                MacroScenario(
                    scenario_id="baseline",
                    name="Q2 Baseline 2026",
                    description="Standard economic trajectory with stable ZiG exchange rates (~13.5) and moderate inflation.",
                    zig_usd_rate=13.5,
                    usd_funding_gap=0.15,
                    inflation_rate=0.18,
                    agricultural_output_index=1.02,
                    gdp_growth=0.035,
                    unemployment_rate=0.08,
                    severity=0.2,
                    confidence=0.85
                ),
                MacroScenario(
                    scenario_id="downturn",
                    name="Severe Shock 2026",
                    description="Significant currency depreciation and agricultural drought impact.",
                    zig_usd_rate=24.0,
                    usd_funding_gap=0.45,
                    inflation_rate=0.65,
                    agricultural_output_index=0.72,
                    gdp_growth=-0.04,
                    unemployment_rate=0.18,
                    severity=0.8,
                    confidence=0.15
                )
            ])

        # 2. Stress Scenarios
        if not db.query(StressScenario).first():
            logger.info("Seeding Stress Scenarios...")
            db.add_all([
                StressScenario(
                    scenario_id="zim_shock_v1",
                    name="Zimbabwe Systemic Shock",
                    description="Simultaneous 40% currency collapse and 200% inflation surge.",
                    fx_shock=0.4,
                    inflation_shock=2.0,
                    default_shock=0.15,
                    liquidity_shock=0.1,
                    correlation_bias=0.6
                ),
                StressScenario(
                    scenario_id="drought_v1",
                    name="El Niño Drought Impact",
                    description="Focus on agricultural sector default contagion.",
                    fx_shock=0.05,
                    inflation_shock=0.15,
                    default_shock=0.45,
                    liquidity_shock=0.05,
                    correlation_bias=0.8
                )
            ])

        # 3. Regulatory Updates
        if not db.query(RegulatoryUpdate).first():
            logger.info("Seeding Regulatory Updates...")
            db.add_all([
                RegulatoryUpdate(
                    update_id="REG-24-001",
                    source="Reserve Bank of Zimbabwe",
                    title="Banking (Capital Adequacy) Guideline No. 02-2024",
                    published_on="2024-03-28",
                    effective_on="2024-07-01",
                    theme="Capital",
                    severity="high",
                    summary="Introduction of a counter-cyclical capital buffer (CCyB) of 1% to mitigate systemic risks.",
                    extracted_rules='{"CAR_MIN": 12.5, "CCYB": 1.0, "TIER1_RATIO": 8.0}'
                )
            ])

        # 4. FX Rates
        if not db.query(FXRate).first():
            logger.info("Seeding FX Rates...")
            db.add_all([
                FXRate(pair="ZiG/USD", source="Official RBZ", rate=13.62, confidence=0.98, captured_at="2024-04-02 10:00"),
                FXRate(pair="ZiG/USD", source="Market Scraper", rate=18.45, confidence=0.72, captured_at="2024-04-02 10:15")
            ])

        # 5. Sample Loans
        if not db.query(Loan).first():
            logger.info("Seeding Loans...")
            sectors = ["Agriculture", "Mining", "Manufacturing", "Retail", "Real Estate"]
            for i in range(50):
                db.add(Loan(
                    loan_id=f"L-2024-{i:03d}",
                    customer_name=f"Corporate Client {chr(65 + (i % 26))}",
                    sector=sectors[i % len(sectors)],
                    currency="USD" if i % 3 == 0 else "ZiG",
                    product_type="Term Loan" if i % 2 == 0 else "Overdraft",
                    days_past_due=0 if i % 10 != 0 else (i * 10),
                    outstanding_principal=500000 + (i * 100000),
                    committed_limit=600000 + (i * 100000),
                    interest_rate=0.12 if i % 3 == 0 else 0.28,
                    collateral_value=700000 + (i * 150000),
                    collateral_type="Real Estate" if i % 2 == 0 else "Cash",
                    expected_recovery_cost=5000,
                    tenor_months=36,
                    branch_code="HRE-01",
                    watchlist=1 if i % 7 == 0 else 0,
                    connected_party_group="Company X" if i % 15 == 0 else "None"
                ))
        
        db.commit()
    logger.info("Seeding complete.")

if __name__ == "__main__":
    seed_data()
