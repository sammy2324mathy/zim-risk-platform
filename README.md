# Zim Risk Platform - Risk OS v1.2.0

An enterprise-grade regulatory compliance and risk management platform tailored for the Zimbabwean financial sector. Designed for IFRS 9 ECL impairment modeling, Monte Carlo capital stress testing, and real-time fraud monitoring.

## 🏛️ Architecture: The Flat Standard
This repository follows the **Senior Architecture Flattening** pattern, designed for maximum auditability and ease of use. All core operational logic is contained within singular root modules to avoid deep nesting and improve developer agility.

### 🐍 Backend (FastAPI + SQLAlchemy)
- `backend/app/api.py`: Centralized REST routing (ECL, Stress, Fraud, Reports).
- `backend/app/engines.py`: Actuarial compute layer (IFRS 9, Monte Carlo, ML Inference).
- `backend/app/models.py`: Flattened persistence layer.
- `backend/app/schemas.py`: Data validation contracts.
- `backend/app/main.py`: Enterprise entry point.

### ⚛️ Frontend (Next.js + Tailwind + Recharts)
- `frontend/src/components/`: Unified UI component library (Metrics, Charts, Tables).
- `frontend/src/pages/`: Modular page views (Dashboard, ECL, Stress, ML).
- `frontend/src/api.ts`: Global API client.
- `frontend/src/types.ts`: Shared TypeScript definitions.

## 🚀 Key High-Fidelity Features
- **Actuarial Intelligence Hub**: SHAP-value feature importance and PD model drift monitoring.
- **Monte Carlo Stress Lab**: 10,000+ stochastic path simulation with RBZ SI-142 baseline integration.
- **Fraud Resonance Lab**: SVG-powered connected-party graph analysis and circular loan detection.
- **ECL Staging Dashboard**: Triple-stage distribution visualizer with macroeconomic scenario probability weighting.

## 🛠️ Quick Start
1. **Initialize Data**:
   ```bash
   cd backend
   $env:PYTHONPATH = "."; python seed.py
   ```
2. **Launch Services**:
   ```bash
   cd infrastructure/docker
   docker-compose -f docker-compose.dev.yml up --build
   ```

## 📜 Compliance Note
This platform is architected to exceed the disclosure requirements of **Statutory Instrument 142/2019** and the **IPEC IFRS 9** circular for risk reporting.
