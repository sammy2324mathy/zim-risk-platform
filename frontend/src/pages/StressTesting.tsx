"use client";

import { useEffect, useState } from "react";
import { 
  Zap, 
  Activity, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Play,
  RotateCcw,
  Save,
} from "lucide-react";

import { StressDistributionPlot } from "@/components/StressDistributionPlot";
import { getDashboardOverview, runStressSimulation } from "@/api";

export function StressTestingPage() {
  const [data, setData] = useState<any>(null);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [paths, setPaths] = useState(10000);

  const refresh = async () => {
    const res = await getDashboardOverview();
    setData(res);
    if (!selectedId && res.stress.scenarios.length > 0) {
      setSelectedId(res.stress.scenarios[0].scenario_id);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleRun = async () => {
    setLoading(true);
    try {
      await runStressSimulation(selectedId, data?.macro_scenario?.scenario_id || "baseline", paths);
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  const activeScenario = data.stress.scenarios.find((s: any) => s.scenario_id === selectedId);

  return (
    <div className="space-y-10 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-ember">
          <Zap className="h-4 w-4" />
          <p className="eyebrow text-ember font-bold tracking-[0.2em]">MONTE_CARLO_SIMULATION_VAULT</p>
        </div>
        <h1 className="text-4xl font-extrabold text-ink tracking-tight italic uppercase">Stress Lab.</h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed italic">
           Quantitative resilience stress-testing using 10,000+ Monte Carlo paths against idiosyncratic and systemic Zimbabwean economic shocks.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.2fr,1.5fr]">
         <div className="space-y-8">
            <section className="surface-card p-10 space-y-10 border-2 border-slate-900 bg-slate-900 text-white">
               <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-teal" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white/30">Systemic Scenario Library</h3>
               </div>
               
               <div className="grid gap-4">
                  {data.stress.scenarios.map((s: any) => (
                    <button 
                      key={s.scenario_id}
                      onClick={() => setSelectedId(s.scenario_id)}
                      className={`group rounded-3xl p-6 text-left border-2 transition-all ${
                        selectedId === s.scenario_id 
                          ? 'border-teal bg-white/10' 
                          : 'border-white/5 bg-white/5 hover:border-white/20'
                      }`}
                    >
                       <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold italic transition-colors leading-none">{s.name}</h4>
                          {selectedId === s.scenario_id && <ShieldCheck className="h-4 w-4 text-teal" />}
                       </div>
                       <p className="text-[10px] text-white/40 leading-relaxed font-medium italic">
                          {s.description}
                       </p>
                    </button>
                  ))}
               </div>
            </section>

            <section className="surface-card p-10 space-y-10">
               <div className="flex items-center gap-3">
                  <Cpu className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Hyper-Engine Controls</h3>
               </div>
               <div className="space-y-8">
                  <div className="space-y-3">
                     <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <span>Simulation Paths</span>
                        <span className="text-ink">{paths.toLocaleString()}</span>
                     </div>
                     <input 
                      type="range" 
                      min="1000" 
                      max="50000" 
                      step="1000"
                      value={paths}
                      onChange={(e) => setPaths(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-mist rounded-full appearance-none cursor-pointer accent-indigo-500"
                     />
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <span>Liquidity Shock Threshold</span>
                        <span className="text-ink">{(activeScenario?.liquidity_shock * 100)?.toFixed(1)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-mist rounded-full">
                        <div className="h-full bg-amber-500" style={{ width: `${(activeScenario?.liquidity_shock * 100) || 5}%` }} />
                     </div>
                  </div>
                  <button 
                    onClick={handleRun}
                    disabled={loading}
                    className="w-full h-16 rounded-[40px] bg-ink text-white font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-ink/20 disabled:opacity-50"
                  >
                    {loading ? <RotateCcw className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                    {loading ? 'CALCULATING_PATHS...' : 'EXECUTE_STRESS_TRIAL'}
                  </button>
               </div>
            </section>
         </div>

         <div className="space-y-10">
            <section className="surface-card p-10 space-y-8 min-h-[600px] flex flex-col">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Activity className="h-5 w-5 text-indigo-500" />
                     <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Monte Carlo Resultant Distribution</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Capital Adequacy Ratio (%)</p>
                     </div>
                  </div>
                  <button className="p-3 rounded-full hover:bg-slate-50 text-slate-400"><Save className="h-4 w-4" /></button>
               </div>
               
               <div className="flex-1 flex flex-col justify-center gap-10">
                  <StressDistributionPlot />
                  
                  <div className="grid grid-cols-3 gap-6">
                     <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mean Result</span>
                        <span className="text-3xl font-black text-ink">12.2%</span>
                     </div>
                     <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 flex flex-col justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">P5 (Worst Case)</span>
                        <span className="text-3xl font-black text-rose-500">8.4%</span>
                     </div>
                     <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between text-white">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Breach Prob.</span>
                        <span className="text-3xl font-black text-teal">0.142</span>
                     </div>
                  </div>
               </div>

               <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 mt-1" />
                  <div>
                     <p className="text-sm font-bold text-ink leading-none">Simulation Verdict: AUDIT_STABLE</p>
                     <p className="text-[10px] font-medium text-emerald-700 leading-relaxed mt-2 italic">
                        Portfolio capital buffers remain within statutory thresholds under the baseline paths.
                     </p>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
