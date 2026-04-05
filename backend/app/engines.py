from __future__ import annotations

import numpy as np
from loguru import logger
from app.models import Loan, MacroScenario, StressScenario, StressRun

def clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(value, upper))

class PDModelService:
    def predict(self, loan: Loan, macro: MacroScenario) -> float:
        """
        ZimRisk PD Model:
        Baseline PD + Sector Risk Adjustment + Macro Volatility Vector
        """
        # Zimbabwe-specific sector risk weights
        SECTOR_RISK = {
            "AGRICULTURE": 1.2, # High due to seasonal volatility
            "MINING": 0.8,      # Stable asset base
            "MANUFACTURING": 1.0,
            "RETAIL": 1.1,
            "FINANCIAL": 0.7,
            "DEFAULT": 1.0
        }
        
        sector_weight = SECTOR_RISK.get(loan.sector.upper(), SECTOR_RISK["DEFAULT"])
        dp_factor = 1.0 + (loan.days_past_due / 90.0) # DPD penalty
        
        # Macro influence: Inflation and GDP drift
        macro_vector = (macro.inflation_rate * 0.2) + (abs(macro.gdp_growth) * 0.1)
        
        pd_estimate = (0.02 * sector_weight * dp_factor) + (macro.severity * macro_vector)
        return clamp(pd_estimate, 0.001, 1.0)

class LGDEngine:
    def compute(self, loan: Loan) -> float:
        """
        Collateral-adjusted LGD calculation
        Haircuts per RBZ SI-142 standard (Internal simplified version)
        """
        HAIRCUTS = {
            "REAL_ESTATE": 0.20,
            "CASH_EQUIVALENT": 0.05,
            "MOTOR_VEHICLE": 0.40,
            "EQUIPMENT": 0.35,
            "UNSECURED": 1.0
        }
        haircut = HAIRCUTS.get(loan.collateral_type.upper(), 1.0)
        net_collateral = loan.collateral_value * (1.0 - haircut)
        
        recovery_rate = min(net_collateral / loan.outstanding_principal, 0.95)
        return clamp(1.0 - recovery_rate, 0.05, 1.0)

class IFRS9Engine:
    def __init__(self, pd_model: PDModelService | None = None, lgd_engine: LGDEngine | None = None):
        self.pd_model = pd_model or PDModelService()
        self.lgd_engine = lgd_engine or LGDEngine()
        
    def classify_stage(self, loan: Loan) -> int:
        """
        IFRS 9 Staging Logic (SI-142 Baseline)
        """
        if loan.days_past_due >= 90: return 3 # Impaired (Default)
        if loan.days_past_due >= 30 or loan.watchlist == 1: return 2 # SICR (Significant Increase in CRM)
        return 1 # Low credit risk

    def compute_ecl(self, loan: Loan, macro: MacroScenario) -> dict:
        stage = self.classify_stage(loan)
        pd = self.pd_model.predict(loan, macro)
        lgd = self.lgd_engine.compute(loan)
        
        # Exposure At Default (outstanding + % committed limit)
        ead = loan.outstanding_principal + (0.15 * max(0, loan.committed_limit - loan.outstanding_principal))
        
        # ECL = PD [Probability] * LGD [Loss] * EAD [Exposure]
        # Stage 1: 12-Month ECL, Stage 2/3: Lifetime ECL
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
            "currency": loan.currency,
            "collateral_type": loan.collateral_type
        }

class StressEngine:
    def __init__(self, engine: IFRS9Engine | None = None):
        self.engine = engine or IFRS9Engine()

    def run_simulation(self, loans: list[Loan], macro: MacroScenario, scenario: StressScenario, paths: int = 5000) -> dict:
        rng = np.random.default_rng(42)
        baseline_results = [self.engine.compute_ecl(l, macro) for l in loans]
        total_baseline = sum(r['ecl'] for r in baseline_results)
        
        # Monte Carlo Simulation over Macro Shocks
        shock_vector = rng.normal(1 + scenario.default_shock, 0.25, paths)
        fx_vector = rng.normal(1 + scenario.fx_shock, 0.15, paths)
        
        # Total ECL distribution under stress
        outcomes = total_baseline * shock_vector * (1 + (fx_vector - 1) * 0.5)
        
        # Sample distribution for visualization (Recharts format)
        sorted_outcomes = np.sort(outcomes)
        indices = np.linspace(0, len(outcomes) - 1, 50, dtype=int)
        sampled = [{
            "capital_ratio": float(14.8 - (sorted_outcomes[i] / 1000000)), 
            "label": f"P{int((i/len(outcomes))*100)}"
        } for i in indices]
        
        return {
            "scenario_id": scenario.scenario_id,
            "expected_loss": float(np.mean(outcomes)),
            "var_95": float(np.percentile(outcomes, 95)),
            "tail_risk": float(np.max(outcomes)),
            "breach_probability": float(np.sum(outcomes > 15000000) / paths),
            "distribution": sampled
        }
