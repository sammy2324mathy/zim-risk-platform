import { CheckCircle2, Cpu, Layers, PlayCircle, RefreshCw, ShieldAlert, Zap } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { runStressSimulation } from "@/api";
import type { StressRun, StressScenario } from "@/types";

type StressPanelProps = {
  runs: StressRun[];
  scenarios: StressScenario[];
  selectedScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  onRefresh: () => Promise<void>;
  activeMacroScenarioId: string;
};

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function StressPanel({
  runs,
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  onRefresh,
  activeMacroScenarioId,
}: StressPanelProps) {
  const [isRunning, setIsRunning] = useState(false);

  const activeRun =
    runs.find((run) => run.scenario_id === selectedScenarioId) ?? runs[0];

  const activeScenario =
    scenarios.find((scenario) => scenario.scenario_id === activeRun?.scenario_id) ??
    scenarios[0];

  const handleRunSimulation = async () => {
    if (!activeScenario || isRunning) return;

    setIsRunning(true);
    try {
      await runStressSimulation(activeScenario.scenario_id, activeMacroScenarioId);
      await onRefresh();
    } finally {
      setIsRunning(false);
    }
  };

  if (!activeRun || !activeScenario) {
    return null;
  }

  return (
    <section className="surface-card overflow-hidden">
      {/* Simulation Header / Engine Status */}
      <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-ember">
            <Cpu className="h-4 w-4" />
            <p className="eyebrow text-ember font-bold">DISTRIBUTED ANALYTICS ENGINE</p>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-ink">Monte Carlo Capital Resilience</h2>
            <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
              {activeScenario.description}
            </p>
          </div>
          
          {/* Mocked Compute Nodes status for 'Architect' feel */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400 uppercase tracking-widest">
              <div className="size-1 bg-emerald-500 rounded-full animate-pulse" />
              Node-Alpha: ACTIVE
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400 uppercase tracking-widest">
              <div className="size-1 bg-emerald-500 rounded-full animate-pulse" />
              Node-Beta: IDLE
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {scenarios.map((scenario) => {
              const selected = scenario.scenario_id === activeScenario.scenario_id;
              return (
                <button
                  key={scenario.scenario_id}
                  type="button"
                  onClick={() => onSelectScenario(scenario.scenario_id)}
                  className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    selected
                      ? "bg-ink text-white shadow-lg shadow-slate-200"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-teal/40 hover:text-slate-700"
                  }`}
                >
                  {scenario.name}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="flex items-center justify-center gap-3 rounded-xl bg-teal px-6 py-3 text-sm font-bold text-white shadow-xl shadow-teal/20 transition-all hover:bg-teal-600 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 fill-current" />
            )}
            <span className="uppercase tracking-[0.1em]">
              {isRunning ? "Running Vectors..." : "Run New Simulation"}
            </span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
          {/* Chart Section with 'Monitor' look */}
          <div className="space-y-6">
            <div className="relative h-72 rounded-2xl bg-[#090f1c] p-6 border border-slate-800 shadow-2xl">
              <div className="absolute top-4 right-6 flex items-center gap-4 text-[9px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-teal" /> SIMULATION PATHS: {activeRun.paths.toLocaleString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-slate-700" /> BASELINE: CAPITAL_RATIO
                </span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={Array.isArray(activeRun.distribution) ? activeRun.distribution : []}>
                  <defs>
                    <linearGradient id="stressFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="label" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)'}}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                    tick={{fill: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)'}}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      backgroundColor: "#0f172a",
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5)",
                      color: "#fff",
                    }}
                    itemStyle={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="capital_ratio"
                    stroke="#2dd4bf"
                    fill="url(#stressFill)"
                    strokeWidth={2.5}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-6">
                 <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">P5 VAR</p>
                    <p className="text-lg font-bold text-ink">{percentFormatter.format(activeRun.percentile_5)}%</p>
                 </div>
                 <div className="space-y-1 border-l border-slate-200 pl-6">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">P50 MEDIAN</p>
                    <p className="text-lg font-bold text-ink">{percentFormatter.format(activeRun.percentile_50)}%</p>
                 </div>
                 <div className="space-y-1 border-l border-slate-200 pl-6">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">P95 UPSIDE</p>
                    <p className="text-lg font-bold text-ink">{percentFormatter.format(activeRun.percentile_95)}%</p>
                 </div>
              </div>
              {activeRun.created_at && (
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">LAST AUDIT RUN</p>
                  <p className="text-[11px] font-bold text-slate-600 uppercase mt-1">
                    {new Date(activeRun.created_at).toLocaleDateString()} @ {new Date(activeRun.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics Column */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-amber-500 p-6 text-white shadow-xl shadow-amber-500/10">
              <div className="flex items-center gap-2 mb-4">
                 <ShieldAlert className="h-4 w-4" />
                 <p className="text-[10px] font-bold uppercase tracking-wider">Breach Risk</p>
              </div>
              <h3 className="text-4xl font-bold mb-1">
                {percentFormatter.format(activeRun.breach_probability * 100)}%
              </h3>
              <p className="text-xs text-white/80 font-medium leading-relaxed">
                Probability of capital slipping below CAR threshold under current shock.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4 text-slate-500">
                 <Layers className="h-4 w-4" />
                 <p className="text-[10px] font-bold uppercase tracking-wider">Projected ECL Impact</p>
              </div>
              <h3 className="text-2xl font-bold text-ink mb-1">
                {currencyFormatter.format(activeRun.expected_loss)}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Full-Portfolio Simulation
              </p>
            </div>
            
            <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                  <CheckCircle2 className="h-3 w-3 text-teal" />
                  IFRS 9 COMPLIANT
               </div>
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                  <CheckCircle2 className="h-3 w-3 text-teal" />
                  BASEL III READY
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


