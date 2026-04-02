from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app.database import Database
from app.models import Loan, MacroScenario, StressScenario, StressRun, FXRate, RegulatoryUpdate
from app.schemas import LoanPayload, MacroScenarioPayload, StressScenarioPayload, StressRunRequest, RegulatoryUpdatePayload
from app.engines import IFRS9Engine, StressEngine

router = APIRouter()

# --- Health ---
@router.get("/health")
def health(): return {"status": "ok", "version": "1.2.0-simple"}

# --- Dashboard ---
@router.get("/dashboard/overview")
def get_overview(db: Session = Depends(Database.get_db)):
    loans = db.query(Loan).all()
    macros = db.query(MacroScenario).all()
    fx = db.query(FXRate).all()
    regs = db.query(RegulatoryUpdate).all()
    
    engine = IFRS9Engine()
    ecls = [engine.compute_ecl(l, macros[0] if macros else MacroScenario()) for l in loans]
    
    return {
        "institution": "ZimRisk Bank",
        "summary": {
            "total_exposure": sum(l.outstanding_principal for l in loans),
            "total_ecl": sum(e['ecl'] for e in ecls),
            "capital_ratio": 15.2,
            "sector_distribution": [
                {"label": "Agriculture", "value": 45},
                {"label": "Retail", "value": 25},
                {"label": "Corporate", "value": 30}
            ],
            "connected_party_alerts": [
                {"group": "Company X Group", "exposure": 4200000, "breach": True}
            ],
            "top_exposures": ecls[:6]
        },
        "exposures": ecls,
        "fx_rates": fx,
        "regulations": {
            "updates": regs,
            "rulebook": { "CAR_MIN": {"value": 12.5, "theme": "Capital"} }
        },
        "stress": { "runs": [], "scenarios": [] },
        "macro_scenario": macros[0] if macros else {}
    }

# --- Portfolio (ECL) ---
@router.get("/portfolio/exposures")
def list_exposures(db: Session = Depends(Database.get_db)):
    loans = db.query(Loan).all()
    macros = db.query(MacroScenario).filter_by(scenario_id="baseline").first()
    engine = IFRS9Engine()
    return [engine.compute_ecl(l, macros) for l in loans]

@router.post("/portfolio/loans")
def create_loan(payload: LoanPayload, db: Session = Depends(Database.get_db)):
    loan = Loan(**payload.model_dump())
    db.add(loan)
    db.commit()
    return loan

# --- Stress ---
@router.get("/stress/scenarios")
def list_scenarios(db: Session = Depends(Database.get_db)):
    return db.query(StressScenario).all()

@router.post("/stress/run")
def run_stress(payload: StressRunRequest, db: Session = Depends(Database.get_db)):
    loans = db.query(Loan).all()
    macro = db.query(MacroScenario).filter_by(scenario_id=payload.macro_scenario_id).first()
    scenario = db.query(StressScenario).filter_by(scenario_id=payload.scenario_id).first()
    
    engine = StressEngine()
    result = engine.run_simulation(loans, macro, scenario, payload.paths)
    
    run = StressRun(
        scenario_id=scenario.scenario_id,
        scenario_name=scenario.name,
        macro_scenario_id=macro.scenario_id,
        paths=payload.paths,
        expected_loss=result['expected_loss'],
        mean_capital_ratio=11.8,
        percentile_5=8.2,
        percentile_50=11.8,
        percentile_95=15.4,
        breach_probability=result['breach_probability'],
        distribution="{}"
    )
    if payload.persist:
        db.add(run)
        db.commit()
        db.refresh(run)
    return run

# --- Fraud ---
@router.get("/fraud/graph")
def get_fraud_graph():
    return {
        "nodes": [{"id": "bank", "label": "Bank", "type": "bank", "x": 250, "y": 50}],
        "links": []
    }

# --- Compliance & Reports ---
@router.get("/regulations/updates")
def list_updates(db: Session = Depends(Database.get_db)):
    return db.query(RegulatoryUpdate).all()

@router.get("/compliance/report/{report_type}")
def generate_report(report_type: str):
    return Response(content=b"PDF_STUB", media_type="application/pdf")
