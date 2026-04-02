"use client";

import { useMemo, useState, useEffect, startTransition } from "react";
import { 
  BarChart3, 
  Cpu, 
  Zap, 
  ShieldAlert, 
  Database, 
  RefreshCw 
} from "lucide-react";

import { StressPanel } from "@/components/StressPanel";
import { getDashboardOverview } from "@/api";
import type { DashboardOverview } from "@/types";

export function StressTestingPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState("");

  const refresh = async () => {
    const data = await getDashboardOverview();
    setOverview(data);
    if (!selectedScenarioId && data.stress.runs.length > 0) {
      setSelectedScenarioId(data.stress.runs[0].scenario_id);
    }
  };

  useEffect(() => {
    let cancelled = false;
    startTransition(() => {
      void getDashboardOverview().then((data) => {
        if (cancelled) return;
        setOverview(data);
        setSelectedScenarioId(data.stress.runs[0]?.scenario_id ?? "");
      });
    });
    return () => {
      cancelled = false;
    };
  }, []);

  if (!overview) return (
    <div className="flex h-[60vh] items-center justify-center">
       <div className="text-center space-y-4">
          <div className="size-12 bg-mist rounded-2xl mx-auto flex items-center justify-center animate-spin">
             <RefreshCw className="h-6 w-6 text-teal" />
          </div>
          <p className="eyebrow">Loading Monte Carlo Runtime</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-ember">
          <BarChart3 className="h-4 w-4" />
          <p className="eyebrow text-ember font-bold tracking-[0.2em]">DISTRIBUTED STRESS SIMULATOR</p>
        </div>
        <h1 className="text-4xl font-extrabold text-ink tracking-tight">Monte Carlo Resilience Lab.</h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed">
          High-performance compute environment for capital adequacy shocks, currency collapse simulations, and tail-risk event modeling.
        </p>
      </header>

      <div className="grid gap-8">
        <StressPanel
          runs={overview.stress.runs}
          scenarios={overview.stress.scenarios}
          selectedScenarioId={selectedScenarioId}
          onSelectScenario={setSelectedScenarioId}
          onRefresh={refresh}
          activeMacroScenarioId={overview.macro_scenario.scenario_id}
        />

        <div className="grid gap-6 md:grid-cols-3">
           <div className="surface-card p-8 space-y-4">
              <div className="size-10 bg-mist rounded-2xl flex items-center justify-center text-teal">
                 <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-ink">Vectorized Compute</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                 Simulations leverage NumPy-vectorized paths for 10,000+ stochastic outcomes in sub-second latency.
              </p>
           </div>
           <div className="surface-card p-8 space-y-4">
              <div className="size-10 bg-mist rounded-2xl flex items-center justify-center text-ember">
                 <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-ink">Reverse Stress Testing</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                 Automated identification of minimum shocks required to breach 10% Tier 1 Capital adequacy.
              </p>
           </div>
           <div className="surface-card p-8 space-y-4">
              <div className="size-10 bg-mist rounded-2xl flex items-center justify-center text-indigo-500">
                 <Database className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-ink">Scenario Archival</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                 Historical versioning of all stress runs for audit reconstruction and RBZ methodology reviews.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

