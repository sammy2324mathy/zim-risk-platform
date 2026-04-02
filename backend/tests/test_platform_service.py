from __future__ import annotations

import unittest
from dataclasses import asdict
from datetime import date
from pathlib import Path
import shutil
from uuid import uuid4

from app.core.database import SQLiteDatabase
from app.domain import FXRate, LoanExposure
from app.repositories.platform import PlatformRepository
from app.services.platform import NotFoundError, PlatformService


class PlatformServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        root = Path(__file__).resolve().parents[1] / ".test-db-files"
        root.mkdir(parents=True, exist_ok=True)
        self.tempdir = root
        self.database_file = root / f"{uuid4().hex}.db"
        self.database_path = str(self.database_file)
        database = SQLiteDatabase(self.database_path)
        database.initialize()
        repository = PlatformRepository(database)
        self.service = PlatformService(repository)
        self.service.bootstrap()

    def tearDown(self) -> None:
        if self.database_file.exists():
            self.database_file.unlink(missing_ok=True)
        shutil.rmtree(self.tempdir, ignore_errors=True)

    def test_bootstrap_populates_reference_data(self) -> None:
        health = self.service.healthcheck()

        self.assertEqual(health["status"], "ok")
        self.assertGreater(health["counts"]["loans"], 0)
        self.assertGreater(health["counts"]["macro_scenarios"], 0)
        self.assertGreater(health["counts"]["stress_scenarios"], 0)

    def test_create_update_delete_loan_round_trip(self) -> None:
        loan = LoanExposure(
            loan_id="L-9001",
            customer_name="Test Borrower",
            sector="Services",
            currency="USD",
            product_type="Term Loan",
            days_past_due=4,
            outstanding_principal=250_000,
            committed_limit=300_000,
            interest_rate=0.14,
            collateral_value=280_000,
            collateral_type="Cash",
            expected_recovery_cost=5_000,
            tenor_months=18,
            branch_code="HRE-99",
            watchlist=False,
            connected_party_group="Test Group",
        )

        created = self.service.save_loan(loan)
        self.assertEqual(created.loan_id, "L-9001")

        updated = self.service.save_loan(
            LoanExposure(
                **{
                    **asdict(loan),
                    "days_past_due": 34,
                    "watchlist": True,
                }
            )
        )
        self.assertEqual(updated.days_past_due, 34)
        self.assertTrue(updated.watchlist)

        self.service.delete_loan("L-9001")
        with self.assertRaises(NotFoundError):
            self.service.get_loan("L-9001")

    def test_stress_runs_are_persisted(self) -> None:
        response = self.service.run_stress_tests(
            scenario_id="currency-dislocation",
            macro_scenario_id="baseline",
            paths=300,
            persist=True,
        )

        self.assertEqual(response["paths"], 300)
        self.assertEqual(len(response["results"]), 1)
        self.assertIsNotNone(response["results"][0].run_id)

        history = self.service.list_stress_runs(limit=5)
        self.assertGreaterEqual(len(history), 1)
        self.assertEqual(history[0].scenario_id, "currency-dislocation")

    def test_fx_rate_crud(self) -> None:
        created = self.service.create_fx_rate(
            FXRate(
                pair="ZiG/BWP",
                source="Cross-border desk",
                rate=0.091,
                confidence=0.67,
                captured_at=date(2026, 4, 2),
            )
        )
        self.assertIsNotNone(created.rate_id)

        updated = self.service.update_fx_rate(
            created.rate_id or 0,
            FXRate(
                pair="ZiG/BWP",
                source="Cross-border desk",
                rate=0.095,
                confidence=0.72,
                captured_at=date(2026, 4, 3),
            ),
        )
        self.assertAlmostEqual(updated.rate, 0.095)
        self.assertEqual(updated.captured_at.isoformat(), "2026-04-03")

        self.service.delete_fx_rate(created.rate_id or 0)
        with self.assertRaises(NotFoundError):
            self.service.get_fx_rate(created.rate_id or 0)


if __name__ == "__main__":
    unittest.main()
