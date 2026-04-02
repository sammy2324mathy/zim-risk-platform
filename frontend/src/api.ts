import type { DashboardOverview } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Dashboard request failed with status ${response.status}`);
  }

  return (await response.json()) as DashboardOverview;
}

export async function runStressSimulation(
  scenarioId: string,
  macroScenarioId: string = "baseline",
  paths: number = 2000,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/stress/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenario_id: scenarioId,
      macro_scenario_id: macroScenarioId,
      paths,
      persist: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Simulation failed with status ${response.status}`);
  }
}
