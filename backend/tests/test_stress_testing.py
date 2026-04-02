from __future__ import annotations

import unittest

from app.data.sample_data import get_macro_scenario, get_sample_loans, get_stress_scenario
from app.services.stress_testing import StressTestingService


class StressTestingServiceTests(unittest.TestCase):
    def test_stress_run_returns_distribution(self) -> None:
        service = StressTestingService()
        result = service.run(
            get_sample_loans(),
            get_macro_scenario("baseline"),
            get_stress_scenario("currency-dislocation"),
            paths=500,
        )

        self.assertEqual(result.paths, 500)
        self.assertGreater(len(result.distribution), 0)
        self.assertGreater(result.expected_loss, 0)
        self.assertGreaterEqual(result.percentile_95, result.percentile_50)


if __name__ == "__main__":
    unittest.main()
