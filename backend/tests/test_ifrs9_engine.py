from __future__ import annotations

import unittest

from app.data.sample_data import get_macro_scenario, get_sample_loans
from app.services.ifrs9 import IFRS9Engine


class IFRS9EngineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = IFRS9Engine()
        self.loans = get_sample_loans()
        self.baseline = get_macro_scenario("baseline")

    def test_stage_assignment_respects_delinquency(self) -> None:
        self.assertEqual(self.engine.classify_stage(self.loans[0]), 1)
        self.assertEqual(self.engine.classify_stage(self.loans[1]), 2)
        self.assertEqual(self.engine.classify_stage(self.loans[2]), 3)

    def test_ecl_is_positive_for_every_exposure(self) -> None:
        breakdowns = self.engine.compute_portfolio(self.loans, self.baseline)
        self.assertTrue(all(item.ecl > 0 for item in breakdowns))

    def test_drought_scenario_increases_pd_for_agriculture(self) -> None:
        drought = get_macro_scenario("drought-shock")
        agricultural_loan = self.loans[0]
        baseline_pd = self.engine.forecast_pd(agricultural_loan, self.baseline)
        drought_pd = self.engine.forecast_pd(agricultural_loan, drought)

        self.assertGreater(drought_pd, baseline_pd)


if __name__ == "__main__":
    unittest.main()

