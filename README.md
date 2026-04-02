# Zim Risk Platform

Backend-first MVP for a Zimbabwe-focused regulatory compliance and risk management platform. This repository includes:

- A FastAPI backend with a persistent SQLite-backed data layer, IFRS 9 expected credit loss engine, portfolio analytics, stress testing, connected-party exposure alerts, and a regulatory rulebook feed.
- A Next.js dashboard tailored for risk, capital, FX, and regulatory monitoring workflows.
- Local infrastructure scaffolding for PostgreSQL/Timescale, Redis, and MinIO via Docker Compose.

## Workspace Layout

```text
zim-risk-platform/
├── backend/   # FastAPI services, sample data, tests
├── frontend/  # Next.js dashboard
├── docker-compose.yml
└── README.md
```

## What Is Implemented

### Backend

- `GET /api/v1/health`
- `GET /api/v1/dashboard/overview`
- `GET /api/v1/portfolio/summary?scenario_id=baseline`
- `GET /api/v1/portfolio/exposures?scenario_id=baseline`
- `GET|POST /api/v1/portfolio/loans`
- `GET|PUT|DELETE /api/v1/portfolio/loans/{loan_id}`
- `GET|POST /api/v1/portfolio/macro-scenarios`
- `GET|PUT|DELETE /api/v1/portfolio/macro-scenarios/{scenario_id}`
- `GET /api/v1/portfolio/fx-rates`
- `GET|POST /api/v1/stress/scenarios`
- `GET|PUT|DELETE /api/v1/stress/scenarios/{scenario_id}`
- `POST /api/v1/stress/run`
- `GET /api/v1/stress/runs`
- `GET /api/v1/stress/runs/{run_id}`
- `GET /api/v1/regulations/updates`
- `GET|POST /api/v1/regulations/updates`
- `GET|PUT|DELETE /api/v1/regulations/updates/{update_id}`
- `GET /api/v1/regulations/rulebook`
- `GET|POST /api/v1/regulations/fx-rates`
- `GET|PUT|DELETE /api/v1/regulations/fx-rates/{rate_id}`

### Frontend

- Portfolio summary cards
- Macro and FX snapshot panel
- Monte Carlo stress scenario explorer
- Exposure-level IFRS 9 table
- Regulatory update timeline with compiled rulebook
- Offline fallback data for demos and unstable environments

## Run Locally

### Backend

```powershell
cd C:\Users\MJ\Desktop\zim-risk-platform\backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend

```powershell
cd C:\Users\MJ\Desktop\zim-risk-platform\frontend
npm.cmd install
npm.cmd run dev
```

### Docker Compose

```powershell
cd C:\Users\MJ\Desktop\zim-risk-platform
docker compose up --build
```

## Test

```powershell
cd C:\Users\MJ\Desktop\zim-risk-platform\backend
python -m unittest discover -s tests
```

## Architecture Notes

- The backend now persists loans, macro scenarios, stress scenarios, regulatory updates, FX rates, and stress-run history into a local SQLite database.
- On first boot, the API seeds the database with curated demo data so the platform is usable immediately in development.
- The service boundaries are still separated so PostgreSQL/Timescale repositories can replace SQLite later without rewriting the API contract.
- The frontend fetches the live dashboard payload when available and falls back to a local snapshot when the API is offline, which is useful for branch-office or demo conditions.

## Suggested Next Steps

1. Swap the SQLite repository for PostgreSQL/Timescale in production and add migrations.
2. Add authentication and role-based access control for bank users, regulators, and platform admins.
3. Introduce real rate ingestion, XML/PDF regulatory export workflows, and tenant-aware organization boundaries.
4. Extend the risk engine with graph exposure analysis and transaction-stream anomaly detection.
