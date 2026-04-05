"use client";

import type { DashboardOverview, Exposure, StressScenario, StressRun } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

// --- JWT Management ---

function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("zimrisk_auth_token", token);
  }
}

function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("zimrisk_auth_token");
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("zimrisk_auth_token");
    window.location.href = "/login";
  }
}

async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = {
    ...options.headers,
    "Authorization": token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401 || response.status === 403) {
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      logout();
    }
  }
  
  return response;
}

// --- Auth API ---

export async function login(username: string, password: string): Promise<void> {
  // Simple form-data-like approach or JSON depending on backend
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed with status ${response.status}`);
  }

  const data = await response.json();
  if (data.access_token) {
    setToken(data.access_token);
  } else {
    throw new Error("Invalid token response from server");
  }
}

// --- Dashboard & Analytics API ---

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const response = await authenticatedFetch(`${API_BASE_URL}/dashboard/overview`);

  if (!response.ok) {
    throw new Error(`Dashboard request failed with status ${response.status}`);
  }

  return (await response.json()) as DashboardOverview;
}

export async function getExposures(): Promise<Exposure[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/portfolio/exposures`);
  if (!response.ok) {
    throw new Error(`Exposures request failed with status ${response.status}`);
  }
  return await response.json();
}

export async function getStressScenarios(): Promise<StressScenario[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stress/scenarios`);
  if (!response.ok) {
    throw new Error(`Stress scenarios request failed with status ${response.status}`);
  }
  return await response.json();
}

export async function runStressSimulation(
  scenarioId: string,
  macroScenarioId: string = "baseline",
  paths: number = 2000,
): Promise<StressRun> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stress/run`, {
    method: "POST",
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
  return await response.json();
}

export async function getRegulatoryUpdates(): Promise<any[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/regulations/updates`);
  if (!response.ok) {
    throw new Error(`Regulatory updates request failed with status ${response.status}`);
  }
  return await response.json();
}

export async function getFraudGraph(): Promise<any> {
  const response = await authenticatedFetch(`${API_BASE_URL}/fraud/graph`);
  if (!response.ok) {
    throw new Error(`Fraud graph request failed with status ${response.status}`);
  }
  return await response.json();
}

export async function updateLoanStage(loanId: string, stage: number): Promise<void> {
  const response = await authenticatedFetch(`${API_BASE_URL}/portfolio/loans/${loanId}/stage?stage=${stage}`, {
    method: "PUT",
  });
  if (!response.ok) {
    throw new Error(`Failed to update loan staging: ${response.status}`);
  }
}

export function getReportUrl(type: 'rbz_xml' | 'compliance' | 'stress_audit', runId?: number): string {
  const token = getToken();
  const base = `${API_BASE_URL}`;
  let url = "";

  if (type === 'stress_audit' && runId) {
    url = `${base}/compliance/report/stress_audit/${runId}`;
  } else if (type === 'rbz_xml') {
    url = `${base}/compliance/report/rbz_xml`;
  } else {
    url = `${base}/compliance/report/compliance`;
  }
  
  // Appending token for direct downloads if needed
  return token ? `${url}?token=${token}` : url;
}
