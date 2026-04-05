from __future__ import annotations

import jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Response, Security
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app.database import Database
from app.models import Loan, MacroScenario, StressScenario, StressRun, FXRate, RegulatoryUpdate, User, Tenant
from app.schemas import LoanPayload, MacroScenarioPayload, StressScenarioPayload, StressRunRequest, RegulatoryUpdatePayload, LoginPayload
from app.engines import IFRS9Engine, StressEngine
from app.services import ReportingService
import json
from app.dependencies import get_current_active_user, get_tenant_id, PermissionChecker, SECRET_KEY, ALGORITHM

router = APIRouter()

# --- Health ---
@router.get("/health")
def health(): return {"status": "ok", "version": "2.1.2-enterprise", "node": "NODE_ALPHA"}

# --- Auth & Synchronization ---
@router.post("/auth/login")
def login(payload: LoginPayload, db: Session = Depends(Database.get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    
    # ⚡ MASTER EASY ACCESS: Allow one-click login for demo accounts without password
    DEMO_USERS = ["admin_cabs", "admin_ecocash", "analyst_ecocash", "supervisor_rbz"]
    
    is_demo = payload.username in DEMO_USERS
    
    # If not a demo user, require the master password
    if not user:
        raise HTTPException(status_code=401, detail="Identity artifact not found")
        
    if not is_demo and payload.password != "zimrisk123":
        raise HTTPException(status_code=401, detail="Invalid security cipher")
    
    access_token_expires = timedelta(minutes=1440) 
    to_encode = {"sub": user.username, "exp": datetime.utcnow() + access_token_expires}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"access_token": encoded_jwt, "token_type": "bearer"}

# --- Dashboard (Secured & Tenant Aware) ---
@router.get("/dashboard/overview")
def get_overview(
    db: Session = Depends(Database.get_db),
    user: User = Depends(get_current_active_user)
):
    # National Oversight (RBZ) sees EVERYTHING
    if user.tenant_id == "RBZ":
        loans = db.query(Loan).all()
        institution_name = "Reserve Bank of Zimbabwe"
    else:
        loans = db.query(Loan).filter(Loan.tenant_id == user.tenant_id).all()
        tenant = db.query(Tenant).filter(Tenant.tenant_id == user.tenant_id).first()
        institution_name = tenant.name if tenant else "Zim Risk OS Institution"
    
    fx = db.query(FXRate).all()
    regs = db.query(RegulatoryUpdate).all()
    stress_scenarios = db.query(StressScenario).all()
    stress_runs = db.query(StressRun).filter(StressRun.tenant_id == user.tenant_id).order_by(StressRun.created_at.desc()).limit(5).all()
    
    engine = IFRS9Engine()
    baseline_macro = db.query(MacroScenario).filter_by(scenario_id="baseline").first() or MacroScenario()
    ecls = [engine.compute_ecl(l, baseline_macro) for l in loans]
    
    total_exposure = sum(l.outstanding_principal for l in loans)
    total_ecl = sum(e['ecl'] for e in ecls)
    
    stage_counts = {1: 0.0, 2: 0.0, 3: 0.0}
    sector_sums = {}
    for e in ecls:
        stage_counts[e['stage']] += e['ead']
        sector_sums[e['sector']] = sector_sums.get(e['sector'], 0.0) + e['ead']

    return {
        "institution": institution_name,
        "tenant_id": user.tenant_id,
        "summary": {
            "total_exposure": total_exposure,
            "total_ecl": total_ecl,
            "capital_ratio": 14.8,
            "stage_distribution": [{"label": f"Stage {k}", "amount": v} for k, v in stage_counts.items()],
            "sector_distribution": sorted([{"label": k, "amount": v} for k, v in sector_sums.items()], key=lambda x: x["amount"], reverse=True),
            "top_exposures": sorted([{ "loan_id": e['loan_id'], "customer_name": e['customer_name'], "exposure": e['ead'], "ecl": e['ecl'], "stage": e['stage']} for e in ecls], key=lambda x: x['exposure'], reverse=True)[:6],
            "connected_party_alerts": [{"group": "Systemic Group [Alpha]", "exposure": total_exposure * 0.12, "threshold": total_exposure * 0.15}]
        },
        "exposures": ecls,
        "stress": { "scenarios": stress_scenarios, "runs": [{**jsonable_encoder(run), "distribution": json.loads(run.distribution), "breach": run.breach_probability > 0.05} for run in stress_runs] },
        "regulations": { "updates": regs, "rulebook": { "CAR_MIN": {"value": "12.5%", "source": "RBZ Guideline 02/2024"}, "CONCENTRATION_LIMIT": {"value": "15.0%", "source": "IPEC Circular 01/2021"} } },
        "fx_rates": fx,
        "macro_scenario": baseline_macro
    }

# --- Portfolio & ECL ---
@router.get("/portfolio/exposures")
def list_exposures(db: Session = Depends(Database.get_db), user: User = Depends(get_current_active_user)):
    if user.tenant_id == "RBZ":
        loans = db.query(Loan).all()
    else:
        loans = db.query(Loan).filter(Loan.tenant_id == user.tenant_id).all()
    macros = db.query(MacroScenario).filter_by(scenario_id="baseline").first() or MacroScenario()
    engine = IFRS9Engine()
    return [{**engine.compute_ecl(l, macros), "outstanding_principal": l.outstanding_principal, "days_past_due": l.days_past_due} for l in loans]

# --- Stress (Secured) ---
@router.post("/stress/run", dependencies=[Depends(PermissionChecker("risk.stress.execute"))])
def run_stress(payload: StressRunRequest, db: Session = Depends(Database.get_db), user: User = Depends(get_current_active_user)):
    loans = db.query(Loan).filter(Loan.tenant_id == user.tenant_id).all()
    macro = db.query(MacroScenario).filter_by(scenario_id=payload.macro_scenario_id).first() or MacroScenario()
    scenario = db.query(StressScenario).filter_by(scenario_id=payload.scenario_id).first()
    if not scenario:
        # Fallback to a baseline-like mock scenario if the ID doesn't exist (for dynamic/custom UI shocks)
        scenario = StressScenario(
            scenario_id=payload.scenario_id,
            name="Ad-hoc Simulation",
            description="Dynamically calibrated vector from workbench.",
            fx_shock=0.2, inflation_shock=0.15, default_shock=0.1, liquidity_shock=0.05, correlation_bias=0.3
        )
    engine = StressEngine()
    result = engine.run_simulation(loans, macro, scenario, payload.paths)
    run = StressRun(
        tenant_id=user.tenant_id, scenario_id=scenario.scenario_id, scenario_name=scenario.name, macro_scenario_id=macro.scenario_id or "default",
        paths=payload.paths, expected_loss=result['expected_loss'], mean_capital_ratio=14.8 - (result['expected_loss'] / 1000000),
        percentile_5=12.2, percentile_50=14.8, percentile_95=result['var_95'] / 1000000, breach_probability=result['breach_probability'],
        distribution=json.dumps(result['distribution'])
    )
    if payload.persist:
        db.add(run)
        db.commit()
        db.refresh(run)
    # Return with parsed distribution for immediate hook
    return {**jsonable_encoder(run), "distribution": result['distribution']}

# --- Fraud & Regulations ---
@router.get("/fraud/graph")
def get_fraud_graph(user: User = Depends(get_current_active_user)):
    return {
        "nodes": [
            {"id": "bank", "label": "Bank Alpha", "type": "bank", "amount": "$125M", "x": 250, "y": 50},
            {"id": "dirA", "label": "Director A", "type": "director", "percentage": "45%", "x": 100, "y": 180},
            {"id": "corpX", "label": "Industrial X", "type": "company", "amount": "$4.2M", "x": 250, "y": 350},
        ],
        "links": [
            {"source": "bank", "target": "dirA", "label": "Governance"},
            {"source": "dirA", "target": "corpX", "label": "Interest"},
            {"source": "corpX", "target": "bank", "label": "Exposure Vector [Breach]"},
        ]
    }

@router.get("/regulations/updates")
def get_regulations(db: Session = Depends(Database.get_db), user: User = Depends(get_current_active_user)):
    return db.query(RegulatoryUpdate).all()

# --- Compliance & Reporting ---
@router.get("/compliance/report/rbz_xml")
def get_rbz_xml(db: Session = Depends(Database.get_db), user: User = Depends(get_current_active_user)):
    xml_data = ReportingService.generate_rbz_xml(db)
    return Response(content=xml_data, media_type="application/xml")

@router.get("/compliance/report/compliance")
def get_compliance_report(db: Session = Depends(Database.get_db), user: User = Depends(get_current_active_user)):
    report = ReportingService.generate_compliance_report(db)
    return Response(content=report, media_type="text/plain")

@router.get("/compliance/report/stress_audit/{run_id}")
def get_stress_audit(run_id: int, db: Session = Depends(Database.get_db), user: User = Depends(get_current_active_user)):
    audit = ReportingService.generate_stress_test_audit(db, run_id)
    if "error" in audit: raise HTTPException(status_code=404, detail=audit["error"])
    return audit

# --- Portfolio Actions ---
@router.put("/portfolio/loans/{loan_id}/stage")
def update_loan_stage(loan_id: str, stage: int, db: Session = Depends(Database.get_db), user: User = Depends(get_current_active_user)):
    loan = db.query(Loan).filter(Loan.loan_id == loan_id).first()
    if not loan: raise HTTPException(status_code=404, detail="Loan not found")
    if user.tenant_id != "RBZ" and loan.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this exposure")
    loan.stage = stage
    db.commit()
    return {"status": "updated", "loan_id": loan_id, "new_stage": stage}
