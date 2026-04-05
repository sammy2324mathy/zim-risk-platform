export type MacroScenario = {
  scenario_id: string;
  name: string;
  description: string;
  zig_usd_rate: number;
  usd_funding_gap: number;
  inflation_rate: number;
  agricultural_output_index: number;
  gdp_growth: number;
  unemployment_rate: number;
  severity: number;
  confidence: number;
};

export type Exposure = {
  loan_id: string;
  customer_name: string;
  sector: string;
  currency: string;
  stage: number;
  days_past_due: number;
  connected_party_group: string;
  outstanding_principal: number;
  ead: number;
  pd: number;
  lgd: number;
  ecl: number;
};

export type StressDistributionPoint = {
  label: string;
  capital_ratio: number;
};

export type StressRun = {
  run_id?: number;
  scenario_id: string;
  scenario_name: string;
  paths: number;
  expected_loss: number;
  mean_capital_ratio: number;
  percentile_5: number;
  percentile_50: number;
  percentile_95: number;
  breach_probability: number;
  distribution: StressDistributionPoint[];
  created_at?: string;
};

export type StressScenario = {
  scenario_id: string;
  name: string;
  description: string;
  fx_shock: number;
  inflation_shock: number;
  default_shock: number;
  liquidity_shock: number;
  correlation_bias: number;
};

export type RegulatoryUpdate = {
  update_id: string;
  source: string;
  title: string;
  published_on: string;
  effective_on: string;
  theme: string;
  severity: string;
  summary: string;
  extracted_rules: Record<string, string>;
};

export type RulebookEntry = {
  value: string;
  source: string;
  effective_on: string;
  theme: string;
};

export type FXRate = {
  pair: string;
  source: string;
  rate: number;
  confidence: number;
  captured_at: string;
};

export type DashboardOverview = {
  institution: string;
  generated_at: string;
  macro_scenario: MacroScenario;
  summary: {
    total_exposure: number;
    total_ecl: number;
    capital_base: number;
    risk_weighted_assets: number;
    capital_ratio: number;
    stage_distribution: Array<{ label: string; amount: number }>;
    sector_distribution: Array<{ label: string; amount: number }>;
    currency_mix: Array<{ label: string; amount: number }>;
    top_exposures: Array<{
      loan_id: string;
      customer_name: string;
      exposure: number;
      ecl: number;
      stage: number;
    }>;
    connected_party_alerts: Array<{
      group: string;
      exposure: number;
      threshold: number;
    }>;
    macro_confidence: number;
  };
  exposures: Exposure[];
  stress: {
    scenarios: StressScenario[];
    runs: StressRun[];
  };
  regulations: {
    updates: RegulatoryUpdate[];
    rulebook: Record<string, RulebookEntry>;
  };
  fx_rates: FXRate[];
};

