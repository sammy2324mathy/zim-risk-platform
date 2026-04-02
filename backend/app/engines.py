from __future__ import annotations

import numpy as np
from loguru import logger
from app.models import Loan, MacroScenario, StressScenario, StressRun

def clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(value, upper))

class PDModelService:
    def predict(self, loan: Loan, macro: MacroScenario) -> float:
        # Mock ML inference
        return 0.05 + (macro.severity * 0.1)

class IFRS9Engine:
    def __init__(self, pd_model: PDModelService | None = None):
        self.pd_model = pd_model or PDModelService()
        
    def classify_stage(self, loan: Loan) -> int:
        if loan.days_past_due >= 90: return 3
        if loan.days_past_due >= 30 or loan.watchlist: return 2
        return 1

    def compute_ecl(self, loan: Loan, macro: MacroScenario) -> dict:
        stage = self.classify_stage(loan)
        pd = self.pd_model.predict(loan, macro)
        lgd = 0.45 # Simple LGD for flat architecture
        ead = loan.outstanding_principal * 1.1
        ecl = pd * lgd * ead
        
        return {
            "loan_id": loan.loan_id,
            "customer_name": loan.customer_name,
            "stage": stage,
            "pd": round(pd, 4),
            "lgd": round(lgd, 4),
            "ead": round(ead, 2),
            "ecl": round(ecl, 2),
            "sector": loan.sector,
            "currency": loan.currency
        }

class StressEngine:
    def __init__(self, engine: IFRS9Engine | None = None):
        self.engine = engine or IFRS9Engine()

    def run_simulation(self, loans: list[Loan], macro: MacroScenario, scenario: StressScenario, paths: int = 2000) -> dict:
        rng = np.random.default_rng(42)
        baseline_ecls = [self.engine.compute_ecl(l, macro)['ecl'] for l in loans]
        total_baseline = sum(baseline_ecls)
        
        multipliers = rng.normal(1 + scenario.default_shock, 0.15, paths)
        outcomes = total_baseline * multipliers
        
        return {
            "scenario_id": scenario.scenario_id,
            "expected_loss": float(np.mean(outcomes)),
            "percentile_95": float(np.percentile(outcomes, 95)),
            "breach_probability": float(np.sum(outcomes > 10000000) / paths)
        }
