from __future__ import annotations

from datetime import date

from app.domain import FXRate, LoanExposure, MacroScenario, RegulatoryUpdate, StressScenario


SAMPLE_LOANS: tuple[LoanExposure, ...] = (
    LoanExposure(
        loan_id="L-1001",
        customer_name="AgroExport Ltd",
        sector="Agriculture",
        currency="USD",
        product_type="Term Loan",
        days_past_due=12,
        outstanding_principal=1_250_000,
        committed_limit=1_500_000,
        interest_rate=0.12,
        collateral_value=1_800_000,
        collateral_type="Real Estate",
        expected_recovery_cost=45_000,
        tenor_months=36,
        branch_code="HRE-01",
        watchlist=False,
        connected_party_group="Mhofu Group",
    ),
    LoanExposure(
        loan_id="L-1002",
        customer_name="Sunrise Milling",
        sector="Manufacturing",
        currency="ZiG",
        product_type="Revolving Credit",
        days_past_due=47,
        outstanding_principal=1_250_000,
        committed_limit=1_500_000,
        interest_rate=0.19,
        collateral_value=600_000,
        collateral_type="Equipment",
        expected_recovery_cost=120_000,
        tenor_months=24,
        branch_code="BYO-03",
        watchlist=True,
        connected_party_group="Sunrise Holdings",
    ),
    LoanExposure(
        loan_id="L-1003",
        customer_name="Urban Homes Developments",
        sector="Real Estate",
        currency="USD",
        product_type="Project Finance",
        days_past_due=95,
        outstanding_principal=2_100_000,
        committed_limit=2_500_000,
        interest_rate=0.16,
        collateral_value=1_400_000,
        collateral_type="Real Estate",
        expected_recovery_cost=200_000,
        tenor_months=60,
        branch_code="HRE-02",
        watchlist=True,
        connected_party_group="Urban Axis",
    ),
    LoanExposure(
        loan_id="L-1004",
        customer_name="Kuda Retail",
        sector="Retail",
        currency="ZiG",
        product_type="Overdraft",
        days_past_due=18,
        outstanding_principal=430_000,
        committed_limit=700_000,
        interest_rate=0.24,
        collateral_value=250_000,
        collateral_type="Cash",
        expected_recovery_cost=20_000,
        tenor_months=12,
        branch_code="GWE-01",
        watchlist=False,
        connected_party_group="Kuda Group",
    ),
    LoanExposure(
        loan_id="L-1005",
        customer_name="Hupenyu Clinics",
        sector="Healthcare",
        currency="USD",
        product_type="Term Loan",
        days_past_due=5,
        outstanding_principal=980_000,
        committed_limit=1_100_000,
        interest_rate=0.11,
        collateral_value=1_250_000,
        collateral_type="Cash",
        expected_recovery_cost=15_000,
        tenor_months=30,
        branch_code="MSV-02",
        watchlist=False,
        connected_party_group="Hupenyu Holdings",
    ),
    LoanExposure(
        loan_id="L-1006",
        customer_name="Zambezi Haulage",
        sector="Transport",
        currency="USD",
        product_type="Trade Finance",
        days_past_due=63,
        outstanding_principal=650_000,
        committed_limit=900_000,
        interest_rate=0.14,
        collateral_value=450_000,
        collateral_type="Receivables",
        expected_recovery_cost=60_000,
        tenor_months=18,
        branch_code="VFA-01",
        watchlist=True,
        connected_party_group="Zambezi Logistics",
    ),
    LoanExposure(
        loan_id="L-1007",
        customer_name="Delta Minerals",
        sector="Mining",
        currency="USD",
        product_type="Term Loan",
        days_past_due=0,
        outstanding_principal=1_750_000,
        committed_limit=2_000_000,
        interest_rate=0.13,
        collateral_value=2_600_000,
        collateral_type="Equipment",
        expected_recovery_cost=90_000,
        tenor_months=42,
        branch_code="BUL-02",
        watchlist=False,
        connected_party_group="Mhofu Group",
    ),
    LoanExposure(
        loan_id="L-1008",
        customer_name="GreenGrid Solar",
        sector="Energy",
        currency="ZiG",
        product_type="Project Finance",
        days_past_due=28,
        outstanding_principal=1_520_000,
        committed_limit=2_000_000,
        interest_rate=0.18,
        collateral_value=2_100_000,
        collateral_type="Real Estate",
        expected_recovery_cost=70_000,
        tenor_months=48,
        branch_code="HRE-04",
        watchlist=False,
        connected_party_group="GreenGrid Group",
    ),
    LoanExposure(
        loan_id="L-1009",
        customer_name="Civic Foods",
        sector="Manufacturing",
        currency="ZiG",
        product_type="Invoice Finance",
        days_past_due=104,
        outstanding_principal=780_000,
        committed_limit=800_000,
        interest_rate=0.22,
        collateral_value=300_000,
        collateral_type="Receivables",
        expected_recovery_cost=85_000,
        tenor_months=14,
        branch_code="BYO-03",
        watchlist=True,
        connected_party_group="Sunrise Holdings",
    ),
    LoanExposure(
        loan_id="L-1010",
        customer_name="Mukuru Telecom",
        sector="Telecoms",
        currency="USD",
        product_type="Term Loan",
        days_past_due=2,
        outstanding_principal=1_260_000,
        committed_limit=1_500_000,
        interest_rate=0.1,
        collateral_value=800_000,
        collateral_type="Receivables",
        expected_recovery_cost=40_000,
        tenor_months=30,
        branch_code="HRE-06",
        watchlist=False,
        connected_party_group="Mukuru Group",
    ),
)


MACRO_SCENARIOS: tuple[MacroScenario, ...] = (
    MacroScenario(
        scenario_id="baseline",
        name="Baseline",
        description="Current portfolio view using indicative RBZ rates and bank macro assumptions.",
        zig_usd_rate=13.8,
        usd_funding_gap=0.08,
        inflation_rate=0.17,
        agricultural_output_index=1.02,
        gdp_growth=0.03,
        unemployment_rate=0.14,
        severity=0.22,
        confidence=0.91,
    ),
    MacroScenario(
        scenario_id="tight-liquidity",
        name="Tight Liquidity",
        description="Funding costs rise, FX availability tightens, and cash buffers compress.",
        zig_usd_rate=15.4,
        usd_funding_gap=0.15,
        inflation_rate=0.26,
        agricultural_output_index=0.95,
        gdp_growth=0.015,
        unemployment_rate=0.17,
        severity=0.5,
        confidence=0.84,
    ),
    MacroScenario(
        scenario_id="drought-shock",
        name="Drought Shock",
        description="Agricultural output underperforms and supply-chain defaults feed through to other sectors.",
        zig_usd_rate=16.2,
        usd_funding_gap=0.18,
        inflation_rate=0.32,
        agricultural_output_index=0.72,
        gdp_growth=0.005,
        unemployment_rate=0.22,
        severity=0.68,
        confidence=0.78,
    ),
)


STRESS_SCENARIOS: tuple[StressScenario, ...] = (
    StressScenario(
        scenario_id="currency-dislocation",
        name="Currency Dislocation",
        description="Parallel-market pressure widens and foreign-currency liabilities reprice sharply.",
        fx_shock=0.28,
        inflation_shock=0.18,
        default_shock=0.12,
        liquidity_shock=0.1,
        correlation_bias=0.08,
    ),
    StressScenario(
        scenario_id="agri-failure",
        name="Agricultural Failure",
        description="Drought, export shortfalls, and downstream working-capital strain increase defaults.",
        fx_shock=0.12,
        inflation_shock=0.22,
        default_shock=0.15,
        liquidity_shock=0.08,
        correlation_bias=0.12,
    ),
    StressScenario(
        scenario_id="connected-party-cascade",
        name="Connected Party Cascade",
        description="A related-party concentration shock drives multiple obligors into simultaneous distress.",
        fx_shock=0.08,
        inflation_shock=0.1,
        default_shock=0.21,
        liquidity_shock=0.05,
        correlation_bias=0.22,
    ),
)


REGULATORY_UPDATES: tuple[RegulatoryUpdate, ...] = (
    RegulatoryUpdate(
        update_id="rbz-2026-01-capital",
        source="Reserve Bank of Zimbabwe",
        title="Capital Buffer Clarification for Locally Systemic Banks",
        published_on=date(2026, 1, 11),
        effective_on=date(2026, 4, 1),
        theme="Capital Adequacy",
        severity="High",
        summary="Introduces a higher internal escalation threshold for banks whose concentration risk breaches connected exposure limits.",
        extracted_rules={
            "capital_adequacy_minimum": "12%",
            "internal_escalation_trigger": "13.5%",
            "connected_exposure_limit": "15% of tier-one capital",
        },
    ),
    RegulatoryUpdate(
        update_id="rbz-2026-02-ifrs9",
        source="Reserve Bank of Zimbabwe",
        title="Expected Credit Loss Overlay Guidance",
        published_on=date(2026, 2, 19),
        effective_on=date(2026, 5, 1),
        theme="IFRS 9",
        severity="Medium",
        summary="Requires banks to document management overlays for inflation, FX dislocations, and agricultural-output deterioration.",
        extracted_rules={
            "overlay_documentation": "Mandatory quarterly memo",
            "macro_variables": "ZiG/USD, inflation, agri output, sector NPLs",
            "retraining_frequency": "Quarterly",
        },
    ),
    RegulatoryUpdate(
        update_id="ipec-2026-03-aml",
        source="IPEC / Government Gazette",
        title="Enhanced AML Reporting for Mobile Money Intermediaries",
        published_on=date(2026, 3, 14),
        effective_on=date(2026, 6, 1),
        theme="AML Monitoring",
        severity="High",
        summary="Adds a 24-hour filing expectation for suspicious transaction clusters involving mobile money aggregation accounts.",
        extracted_rules={
            "suspicious_cluster_window": "24 hours",
            "mobile_money_threshold": "USD 10,000 equivalent",
            "required_artifacts": "Customer graph, transaction trail, SAR PDF",
        },
    ),
)


FX_RATES: tuple[FXRate, ...] = (
    FXRate(
        pair="ZiG/USD",
        source="RBZ indicative",
        rate=13.82,
        confidence=0.91,
        captured_at=date(2026, 4, 2),
    ),
    FXRate(
        pair="ZiG/USD",
        source="Treasury desk blended",
        rate=14.07,
        confidence=0.84,
        captured_at=date(2026, 4, 2),
    ),
    FXRate(
        pair="USD/ZAR",
        source="Regional reference",
        rate=18.41,
        confidence=0.95,
        captured_at=date(2026, 4, 2),
    ),
)


def get_sample_loans() -> list[LoanExposure]:
    return list(SAMPLE_LOANS)


def get_macro_scenarios() -> list[MacroScenario]:
    return list(MACRO_SCENARIOS)


def get_macro_scenario(scenario_id: str) -> MacroScenario:
    for scenario in MACRO_SCENARIOS:
        if scenario.scenario_id == scenario_id:
            return scenario
    raise KeyError(f"Unknown macro scenario: {scenario_id}")


def get_stress_scenarios() -> list[StressScenario]:
    return list(STRESS_SCENARIOS)


def get_stress_scenario(scenario_id: str) -> StressScenario:
    for scenario in STRESS_SCENARIOS:
        if scenario.scenario_id == scenario_id:
            return scenario
    raise KeyError(f"Unknown stress scenario: {scenario_id}")


def get_regulatory_updates() -> list[RegulatoryUpdate]:
    return list(REGULATORY_UPDATES)


def get_fx_rates() -> list[FXRate]:
    return list(FX_RATES)

