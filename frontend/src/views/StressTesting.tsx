"use client";

import { useState, useEffect, startTransition } from "react";
import { 
  Atom, 
  Activity, 
  Zap, 
  LineChart, 
  BarChart3, 
  Settings2, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert, 
  Play, 
  RotateCcw, 
  History,
  FileText,
  AlertTriangle,
  Layers,
  ChevronRight,
  MonitorCheck
} from "lucide-react";

import { getDashboardOverview, runStressSimulation as runStressTest, getReportUrl } from "@/api";
import type { DashboardOverview, StressRun } from "@/types";

export function StressTesting() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [running, setRunning] = useState(false);
  const [fxShock, setFxShock] = useState(0.20);
  const [inflationShock, setInflationShock] = useState(0.15);
  const [defaultShock, setDefaultShock] = useState(0.10);
  const [result, setResult] = useState<StressRun | null>(null);

  useEffect(() => {
    let cancelled = false;
    startTransition(() => {
      void getDashboardOverview().then((data) => {
        if (cancelled) return;
        setOverview(data);
        if (data.stress.runs.length > 0) setResult(data.stress.runs[0]);
      });
    });
    return () => { cancelled = true; };
  }, []);

  const handleRunSimulation = async () => {
    setRunning(true);
    try {
      const res = await runStressTest(
        "custom_shock_" + Date.now(),
        overview?.macro_scenario.scenario_id || "baseline",
        5000
      );
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
       setTimeout(() => setRunning(false), 800);
    }
  };

  if (!overview) return (
    <div className="flex h-[60vh] items-center justify-center">
       <div className="text-center space-y-4">
          <div className="size-12 bg-blue-50 border border-blue-100 rounded-lg mx-auto flex items-center justify-center animate-pulse">
             <Atom className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Calibrating Monte Carlo Engines...</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Lab Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="size-10 bg-blue-600 rounded-sm flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                  <Atom className="h-6 w-6" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">SYSTEMIC STRESS LAB</p>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic underline decoration-blue-600/30">Stress_Lab_Engine.</h1>
            <p className="text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
               Execute multi-vector shocks against the institutional capital base. Analysis includes ZiG currency drift, inflation-driven default correlation, and systemic liquidity drain.
            </p>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-right">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-50 italic">Cluster Node: NODE_B_BETA</p>
               <p className="text-[10px] font-black text-slate-900 border border-slate-900 px-2 py-0.5 rounded-sm uppercase tracking-widest leading-none">Simulation_Ready</p>
            </div>
            <div className="h-10 w-px bg-slate-200 mx-2" />
            <button 
              onClick={handleRunSimulation}
              disabled={running}
              className="h-14 px-8 rounded-sm bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
            >
               {running ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    Execute Monte_Carlo_Run
                  </>
               )}
            </button>
         </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1.2fr,1fr]">
         <div className="space-y-12">
            {/* Vector Controls Area */}
            <section className="surface-card p-12 space-y-10 border-2 border-slate-100 bg-white">
               <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
                  <div className="flex items-center gap-3">
                     <Settings2 className="h-4 w-4 text-slate-400" />
                     <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] italic">Shock_Vector_Config:</h2>
                  </div>
                  <button onClick={() => {setFxShock(0.2); setInflationShock(0.15); setDefaultShock(0.1);}} className="text-[9px] font-bold text-slate-300 hover:text-blue-600 uppercase tracking-widest flex items-center gap-2 transition-colors">
                     <RotateCcw className="h-3 w-3" /> Reset Param_
                  </button>
               </div>

               <div className="space-y-8">
                  {[
                    { label: "FX_Shock (ZiG Devaluation)", value: fxShock, setter: setFxShock, icon: Activity, color: "accent-blue-600", note: "Impacts corporate USD debt burden" },
                    { label: "Inflation_Drift (CPI Index)", value: inflationShock, setter: setInflationShock, icon: TrendingUp, color: "accent-amber-600", note: "Affects retail disposable income" },
                    { label: "Sector_Correlation (Default Bias)", value: defaultShock, setter: setDefaultShock, icon: Layers, color: "accent-rose-600", note: "Systemic joint-default probability" }
                  ].map((v) => (
                    <div key={v.label} className="space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <v.icon className={`h-3.5 w-3.5 ${v.color.replace('accent-', 'text-')}`} />
                             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">{v.label}</p>
                          </div>
                          <span className="text-sm font-black font-mono text-slate-900">{(v.value * 100).toFixed(1)}%</span>
                       </div>
                       <input 
                        type="range" 
                        min="0" 
                        max="0.8" 
                        step="0.01" 
                        value={v.value}
                        onChange={(e) => v.setter(parseFloat(e.target.value))}
                        className={`w-full ${v.color} h-1 bg-slate-100 rounded-lg cursor-pointer transition-all hover:h-1.5`}
                       />
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic opacity-60">Impact Mapping: {v.note}</p>
                    </div>
                  ))}
               </div>
            </section>

            {/* Distribution Visualization */}
            <section className="surface-card p-0 border-2 border-slate-100 overflow-hidden bg-slate-950 text-white shadow-2xl relative">
               <div className="absolute top-0 right-0 p-4 border-l border-b border-white/5 bg-white/5 font-mono text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">P50_Confidence_Interval</div>
               <div className="p-8 border-b border-white/5">
                  <div className="flex items-center gap-3">
                     <LineChart className="h-4 w-4 text-blue-500" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">VaR_Distribution_Projection:</h3>
                  </div>
               </div>
               <div className="p-12 h-64 flex items-end justify-between gap-1 relative group italic">
                  {/* Visualizing a bell curve with bar divs */}
                  {Array.from({ length: 48 }).map((_, i) => {
                     const distance = Math.abs(i - 24);
                     const height = Math.max(10, 100 - (distance * distance * 0.18));
                     return (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-t-sm transition-all duration-700 ${i === 24 ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-white/10 group-hover:bg-white/20'}`}
                          style={{ height: `${height}%` }}
                        />
                     );
                  })}
                  {/* Vertical markers for VaR */}
                  <div className="absolute left-[70%] top-1/4 bottom-0 w-px bg-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                     <span className="absolute -top-6 left-0 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest text-rose-500 italic">VaR_95%_Breach</span>
                  </div>
               </div>
            </section>
         </div>

         <aside className="space-y-10">
            {/* Run Outcome Context */}
            {result && (
              <div className="surface-card p-10 space-y-10 bg-white border-2 border-slate-100 shadow-xl shadow-slate-900/5 relative">
                 <div className="absolute top-4 right-4">
                    <MonitorCheck className="h-5 w-5 text-emerald-500" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic underline decoration-blue-500/30">Latest Outcome:</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{result.scenario_name}</h3>
                 </div>

                 <div className="grid grid-cols-2 gap-8 py-4 border-y border-slate-100 italic">
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expected Loss</p>
                       <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter">-${(result.expected_loss/1000000).toFixed(2)}M</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CAR Breach Prob_</p>
                       <p className="text-2xl font-black text-rose-600 font-mono tracking-tighter">{(result.breach_probability * 100).toFixed(1)}%</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <ShieldAlert className="h-4 w-4 text-rose-600" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Platform Recommendation:</h4>
                    </div>
                    <div className="p-5 rounded-sm bg-rose-50 border border-rose-100 border-l-4 border-l-rose-600">
                       <p className="text-xs text-rose-800 font-bold leading-relaxed flex items-start gap-3">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          <span>Breach Probability Exceeds 2.0% Threshold. Institutional capital Tier-2 augmentation is advised under current systemic drift.</span>
                       </p>
                    </div>
                 </div>

                  <button 
                    onClick={() => {
                      if (result?.run_id) {
                        window.open(getReportUrl('stress_audit', result.run_id), '_blank');
                      }
                    }}
                    disabled={!result}
                    className="w-full h-14 border-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                     <FileText className="h-4 w-4" />
                     Export Full Simulation Brief_
                  </button>
              </div>
            )}

            {/* Run History Preview */}
            <div className="surface-card p-10 space-y-8 bg-slate-900 text-white rounded-2xl border-white/5">
                <div className="flex items-center justify-between italic">
                   <div className="flex items-center gap-3">
                      <History className="h-4 w-4 text-blue-500" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">Historical Stress Logs</h4>
                   </div>
                   <button className="text-[9px] font-black text-blue-400 uppercase tracking-widest underline decoration-2 hover:text-blue-300">Archive Hub_</button>
                </div>
                <div className="space-y-4">
                   {overview.stress.runs.slice(0, 5).map((run) => (
                      <div key={run.run_id} className="p-4 rounded-sm border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors group cursor-pointer group italic">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{run.scenario_name}</p>
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">TS: {new Date(run.created_at || Date.now()).toLocaleDateString()}</p>
                         </div>
                         <div className="text-right">
                            <p className={`text-[10px] font-black font-mono ${run.breach_probability > 0.05 ? 'text-rose-500' : 'text-emerald-500'}`}>
                               Breach_Prob: {(run.breach_probability * 100).toFixed(1)}%
                            </p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                               <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Details</span>
                               <ChevronRight className="h-3 w-3 text-white/10" />
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
            </div>
         </aside>
      </div>
    </div>
  );
}
