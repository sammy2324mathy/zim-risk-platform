from __future__ import annotations

import json
from dataclasses import asdict
from datetime import date
from typing import List, Optional

from sqlalchemy import delete, desc, func, select
from sqlalchemy.orm import Session

from app.core.database import (
    Database,
    FXRate as DBFXRate,
    Loan as DBLoan,
    MacroScenario as DBMacroScenario,
    RegulatoryUpdate as DBRegulatoryUpdate,
    StressRun as DBStressRun,
    StressScenario as DBStressScenario,
)
from app.data.sample_data import (
    get_fx_rates,
    get_macro_scenarios,
    get_regulatory_updates,
    get_sample_loans,
    get_stress_scenarios,
)
from app.domain import (
    DistributionPoint,
    FXRate,
    LoanExposure,
    MacroScenario,
    RegulatoryUpdate,
    StressScenario,
    StressTestResult,
)


class PlatformRepository:
    def __init__(self, database: Database) -> None:
        self.database = database

    def seed_defaults(self) -> None:
        with self.database.session() as session:
            if not session.query(DBLoan).first():
                for loan in get_sample_loans():
                    session.merge(self._loan_to_db(loan))

            if not session.query(DBMacroScenario).first():
                for scenario in get_macro_scenarios():
                    session.merge(self._macro_scenario_to_db(scenario))

            if not session.query(DBStressScenario).first():
                for scenario in get_stress_scenarios():
                    session.merge(self._stress_scenario_to_db(scenario))

            if not session.query(DBRegulatoryUpdate).first():
                for update in get_regulatory_updates():
                    session.merge(self._regulatory_update_to_db(update))

            if not session.query(DBFXRate).first():
                for rate in get_fx_rates():
                    session.add(self._fx_rate_to_db(rate))

    def count_loans(self) -> int:
        with self.database.session() as session:
            return session.query(func.count(DBLoan.loan_id)).scalar() or 0

    def list_loans(self) -> list[LoanExposure]:
        with self.database.session() as session:
            stmt = select(DBLoan).order_by(DBLoan.customer_name)
            rows = session.execute(stmt).scalars().all()
            return [self._db_to_loan(row) for row in rows]

    def get_loan(self, loan_id: str) -> LoanExposure | None:
        with self.database.session() as session:
            row = session.get(DBLoan, loan_id)
            return self._db_to_loan(row) if row else None

    def upsert_loan(self, loan: LoanExposure) -> LoanExposure:
        with self.database.session() as session:
            db_loan = self._loan_to_db(loan)
            session.merge(db_loan)
            return loan

    def delete_loan(self, loan_id: str) -> bool:
        with self.database.session() as session:
            obj = session.get(DBLoan, loan_id)
            if obj:
                session.delete(obj)
                return True
            return False

    def count_macro_scenarios(self) -> int:
        with self.database.session() as session:
            return session.query(func.count(DBMacroScenario.scenario_id)).scalar() or 0

    def list_macro_scenarios(self) -> list[MacroScenario]:
        with self.database.session() as session:
            stmt = select(DBMacroScenario).order_by(DBMacroScenario.severity, DBMacroScenario.name)
            rows = session.execute(stmt).scalars().all()
            return [self._db_to_macro_scenario(row) for row in rows]

    def get_macro_scenario(self, scenario_id: str) -> MacroScenario | None:
        with self.database.session() as session:
            row = session.get(DBMacroScenario, scenario_id)
            return self._db_to_macro_scenario(row) if row else None

    def upsert_macro_scenario(self, scenario: MacroScenario) -> MacroScenario:
        with self.database.session() as session:
            session.merge(self._macro_scenario_to_db(scenario))
            return scenario

    def count_stress_scenarios(self) -> int:
        with self.database.session() as session:
            return session.query(func.count(DBStressScenario.scenario_id)).scalar() or 0

    def list_stress_scenarios(self) -> list[StressScenario]:
        with self.database.session() as session:
            stmt = select(DBStressScenario).order_by(DBStressScenario.name)
            rows = session.execute(stmt).scalars().all()
            return [self._db_to_stress_scenario(row) for row in rows]

    def get_stress_scenario(self, scenario_id: str) -> StressScenario | None:
        with self.database.session() as session:
            row = session.get(DBStressScenario, scenario_id)
            return self._db_to_stress_scenario(row) if row else None

    def upsert_stress_scenario(self, scenario: StressScenario) -> StressScenario:
        with self.database.session() as session:
            session.merge(self._stress_scenario_to_db(scenario))
            return scenario

    def count_regulatory_updates(self) -> int:
        with self.database.session() as session:
            return session.query(func.count(DBRegulatoryUpdate.update_id)).scalar() or 0

    def list_regulatory_updates(self) -> list[RegulatoryUpdate]:
        with self.database.session() as session:
            stmt = select(DBRegulatoryUpdate).order_by(desc(DBRegulatoryUpdate.published_on))
            rows = session.execute(stmt).scalars().all()
            return [self._db_to_regulatory_update(row) for row in rows]

    def get_regulatory_update(self, update_id: str) -> RegulatoryUpdate | None:
        with self.database.session() as session:
            row = session.get(DBRegulatoryUpdate, update_id)
            return self._db_to_regulatory_update(row) if row else None

    def upsert_regulatory_update(self, update: RegulatoryUpdate) -> RegulatoryUpdate:
        with self.database.session() as session:
            session.merge(self._regulatory_update_to_db(update))
            return update

    def count_fx_rates(self) -> int:
        with self.database.session() as session:
            return session.query(func.count(DBFXRate.rate_id)).scalar() or 0

    def list_fx_rates(self, pair: str | None = None) -> list[FXRate]:
        with self.database.session() as session:
            stmt = select(DBFXRate).order_by(desc(DBFXRate.captured_at))
            if pair:
                stmt = stmt.where(DBFXRate.pair == pair)
            rows = session.execute(stmt).scalars().all()
            return [self._db_to_fx_rate(row) for row in rows]

    def create_fx_rate(self, rate: FXRate) -> FXRate:
        with self.database.session() as session:
            db_obj = self._fx_rate_to_db(rate)
            session.add(db_obj)
            session.flush()
            return self._db_to_fx_rate(db_obj)

    def list_stress_runs(self, limit: int = 20) -> list[StressTestResult]:
        with self.database.session() as session:
            stmt = select(DBStressRun).order_by(desc(DBStressRun.created_at)).limit(limit)
            rows = session.execute(stmt).scalars().all()
            return [self._db_to_stress_run(row) for row in rows]

    def create_stress_run(self, result: StressTestResult) -> StressTestResult:
        with self.database.session() as session:
            db_obj = DBStressRun(
                scenario_id=result.scenario_id,
                scenario_name=result.scenario_name,
                macro_scenario_id=result.macro_scenario_id or "baseline",
                paths=result.paths,
                expected_loss=result.expected_loss,
                mean_capital_ratio=result.mean_capital_ratio,
                percentile_5=result.percentile_5,
                percentile_50=result.percentile_50,
                percentile_95=result.percentile_95,
                breach_probability=result.breach_probability,
                distribution=json.dumps([asdict(p) for p in result.distribution]),
            )
            session.add(db_obj)
            session.flush()
            return self._db_to_stress_run(db_obj)

    # DTO mapping methods
    def _loan_to_db(self, loan: LoanExposure) -> DBLoan:
        return DBLoan(
            loan_id=loan.loan_id,
            customer_name=loan.customer_name,
            sector=loan.sector,
            currency=loan.currency,
            product_type=loan.product_type,
            days_past_due=loan.days_past_due,
            outstanding_principal=loan.outstanding_principal,
            committed_limit=loan.committed_limit,
            interest_rate=loan.interest_rate,
            collateral_value=loan.collateral_value,
            collateral_type=loan.collateral_type,
            expected_recovery_cost=loan.expected_recovery_cost,
            tenor_months=loan.tenor_months,
            branch_code=loan.branch_code,
            watchlist=int(loan.watchlist),
            connected_party_group=loan.connected_party_group,
        )

    def _db_to_loan(self, row: DBLoan) -> LoanExposure:
        return LoanExposure(
            loan_id=row.loan_id,
            customer_name=row.customer_name,
            sector=row.sector,
            currency=row.currency,
            product_type=row.product_type,
            days_past_due=row.days_past_due,
            outstanding_principal=row.outstanding_principal,
            committed_limit=row.committed_limit,
            interest_rate=row.interest_rate,
            collateral_value=row.collateral_value,
            collateral_type=row.collateral_type,
            expected_recovery_cost=row.expected_recovery_cost,
            tenor_months=row.tenor_months,
            branch_code=row.branch_code,
            watchlist=bool(row.watchlist),
            connected_party_group=row.connected_party_group,
        )

    def _macro_scenario_to_db(self, scenario: MacroScenario) -> DBMacroScenario:
        return DBMacroScenario(
            scenario_id=scenario.scenario_id,
            name=scenario.name,
            description=scenario.description,
            zig_usd_rate=scenario.zig_usd_rate,
            usd_funding_gap=scenario.usd_funding_gap,
            inflation_rate=scenario.inflation_rate,
            agricultural_output_index=scenario.agricultural_output_index,
            gdp_growth=scenario.gdp_growth,
            unemployment_rate=scenario.unemployment_rate,
            severity=scenario.severity,
            confidence=scenario.confidence,
        )

    def _db_to_macro_scenario(self, row: DBMacroScenario) -> MacroScenario:
        return MacroScenario(
            scenario_id=row.scenario_id,
            name=row.name,
            description=row.description,
            zig_usd_rate=row.zig_usd_rate,
            usd_funding_gap=row.usd_funding_gap,
            inflation_rate=row.inflation_rate,
            agricultural_output_index=row.agricultural_output_index,
            gdp_growth=row.gdp_growth,
            unemployment_rate=row.unemployment_rate,
            severity=row.severity,
            confidence=row.confidence,
        )

    def _stress_scenario_to_db(self, scenario: StressScenario) -> DBStressScenario:
        return DBStressScenario(
            scenario_id=scenario.scenario_id,
            name=scenario.name,
            description=scenario.description,
            fx_shock=scenario.fx_shock,
            inflation_shock=scenario.inflation_shock,
            default_shock=scenario.default_shock,
            liquidity_shock=scenario.liquidity_shock,
            correlation_bias=scenario.correlation_bias,
        )

    def _db_to_stress_scenario(self, row: DBStressScenario) -> StressScenario:
        return StressScenario(
            scenario_id=row.scenario_id,
            name=row.name,
            description=row.description,
            fx_shock=row.fx_shock,
            inflation_shock=row.inflation_shock,
            default_shock=row.default_shock,
            liquidity_shock=row.liquidity_shock,
            correlation_bias=row.correlation_bias,
        )

    def _regulatory_update_to_db(self, update: RegulatoryUpdate) -> DBRegulatoryUpdate:
        return DBRegulatoryUpdate(
            update_id=update.update_id,
            source=update.source,
            title=update.title,
            published_on=update.published_on.isoformat(),
            effective_on=update.effective_on.isoformat(),
            theme=update.theme,
            severity=update.severity,
            summary=update.summary,
            extracted_rules=json.dumps(update.extracted_rules),
        )

    def _db_to_regulatory_update(self, row: DBRegulatoryUpdate) -> RegulatoryUpdate:
        return RegulatoryUpdate(
            update_id=row.update_id,
            source=row.source,
            title=row.title,
            published_on=date.fromisoformat(row.published_on),
            effective_on=date.fromisoformat(row.effective_on),
            theme=row.theme,
            severity=row.severity,
            summary=row.summary,
            extracted_rules=dict(json.loads(row.extracted_rules)),
        )

    def _fx_rate_to_db(self, rate: FXRate) -> DBFXRate:
        return DBFXRate(
            pair=rate.pair,
            source=rate.source,
            rate=rate.rate,
            confidence=rate.confidence,
            captured_at=rate.captured_at.isoformat(),
        )

    def _db_to_fx_rate(self, row: DBFXRate) -> FXRate:
        return FXRate(
            pair=row.pair,
            source=row.source,
            rate=row.rate,
            confidence=row.confidence,
            captured_at=date.fromisoformat(row.captured_at),
            rate_id=row.rate_id,
        )

    def _db_to_stress_run(self, row: DBStressRun) -> StressTestResult:
        distribution = [
            DistributionPoint(**item)
            for item in json.loads(row.distribution)
        ]
        return StressTestResult(
            scenario_id=row.scenario_id,
            scenario_name=row.scenario_name,
            paths=row.paths,
            expected_loss=row.expected_loss,
            mean_capital_ratio=row.mean_capital_ratio,
            percentile_5=row.percentile_5,
            percentile_50=row.percentile_50,
            percentile_95=row.percentile_95,
            breach_probability=row.breach_probability,
            distribution=distribution,
            run_id=row.run_id,
            macro_scenario_id=row.macro_scenario_id,
            created_at=row.created_at,
        )
