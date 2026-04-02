"use client";

import { 
  BrainCircuit, 
  Terminal, 
  Settings, 
  Sparkles, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Box 
} from "lucide-react";

const modelPipeline = [
  { name: "PD Model (XGBoost)", v: "2.4.0", status: "Active", drift: "0.02%", lastTrain: "2024-03-28" },
  { name: "LGD Regression (LightGBM)", v: "1.2.1", status: "Evaluating", drift: "0.04%", lastTrain: "2024-03-25" },
  { name: "EAD Time-Series", v: "1.0.0", status: "Draft", drift: "N/A", lastTrain: "Initial Build" },
];

export function MLDevelopmentPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-indigo-500">
          <BrainCircuit className="h-4 w-4" />
          <p className="eyebrow text-indigo-500 font-bold tracking-[0.2em]">INTELLIGENT RISK WORKBENCH</p>
        </div>
        <h1 className="text-4xl font-extrabold text-ink tracking-tight">Actuarial Intelligence Hub.</h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed">
           Proprietary ML training pipeline for asset-level Probability of Default (PD) and Loss Given Default (LGD) modeling.
        </p>
      </header>

      <div className="grid gap-10 xl:grid-cols-[1.5fr,0.9fr]">
        <div className="space-y-8">
           {/* Section 1: Model Pipeline Dashboard */}
           <section className="surface-card p-10 space-y-8 overflow-hidden bg-[#0a0f1c] text-white">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Terminal className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-2xl font-bold">Inference Registry</h2>
                 </div>
                 <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Environment: PERSISTENT_PROD</span>
              </div>
              
              <div className="grid gap-4">
                 {modelPipeline.map((m) => (
                    <div key={m.name} className="group rounded-3xl border border-white/5 bg-white/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-white/[0.08] transition-all">
                       <div className="space-y-1">
                          <div className="flex items-center gap-3">
                             <h4 className="text-lg font-bold italic group-hover:text-teal transition-colors leading-none">{m.name}</h4>
                             <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400">v{m.v}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Latest Audit: {m.lastTrain}</p>
                       </div>
                       <div className="flex items-center gap-10 text-right">
                          <div className="space-y-1">
                             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Stability Metric</p>
                             <p className="text-sm font-mono font-bold text-emerald-400">{(1.0 - parseFloat(m.drift || "0")).toFixed(4)}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Service Status</p>
                             <p className={`text-[10px] font-bold uppercase tracking-widest ${m.status === 'Active' ? 'text-teal' : 'text-amber-500'}`}>{m.status}</p>
                          </div>
                       </div>
                    </div>
                 ))}
                 <button className="w-full h-16 rounded-[40px] border-2 border-dashed border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:border-teal/30 hover:text-teal transition-all">
                    Register New Model Artifact (.pkl / .onnx)
                 </button>
              </div>
           </section>

           {/* Section 2: Telemetry Workbench */}
           <section className="grid gap-6 md:grid-cols-2">
              <div className="surface-card p-8 bg-indigo-600 text-white shadow-xl shadow-indigo-600/10">
                 <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <Sparkles className="h-6 w-6" />
                 </div>
                 <h3 className="text-2xl font-bold mb-2">Automated Discovery</h3>
                 <p className="text-sm text-white/70 leading-relaxed font-medium">
                    Feature-importance radar using SHAP values to identify key risk drivers in the current portfolio.
                 </p>
                 <button className="mt-8 px-6 py-3 rounded-xl bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all">
                    Open ML Radar
                 </button>
              </div>
              
              <div className="surface-card p-10 bg-slate-50 border border-slate-100 flex flex-col justify-between">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <TrendingUp className="h-5 w-5 text-indigo-500" />
                       <h3 className="text-xl font-bold text-ink">Model Drift Monitor</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                       Real-time statistical validation of PD outputs against realized default rates in the Zimbabwean market.
                    </p>
                 </div>
                 <div className="mt-8 flex items-center justify-between px-2 opacity-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Basel III Backtest P50: 0.94</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AUROC Avg: 0.88</span>
                 </div>
              </div>
           </section>
        </div>

        <aside className="space-y-8">
           <div className="surface-card p-8 space-y-10">
              <div className="flex items-center gap-3">
                 <Settings className="h-5 w-5 text-slate-400" />
                 <p className="data-label text-ink italic leading-none">Hyper-Engine Controls</p>
              </div>
              
              <div className="space-y-8">
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                       <span>Training Precision</span>
                       <span className="text-ink">64-BiT</span>
                    </div>
                    <div className="h-1.5 w-full bg-mist rounded-full overflow-hidden">
                       <div className="h-full w-full bg-teal" />
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                       <span>Bayesian Prior (Alpha)</span>
                       <span className="text-ink">0.125</span>
                    </div>
                    <div className="h-1.5 w-full bg-mist rounded-full overflow-hidden">
                       <div className="h-full w-[12.5%] bg-amber-500" />
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                       <span>Iteration Limit</span>
                       <span className="text-ink">2,000</span>
                    </div>
                    <div className="h-1.5 w-full bg-mist rounded-full overflow-hidden">
                       <div className="h-full w-3/4 bg-indigo-500" />
                    </div>
                 </div>
              </div>

              <div className="grid gap-3 pt-4">
                 <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 italic font-bold text-xs text-ink">
                    <ShieldCheck className="h-3 w-3 text-teal" /> Overfitting Guard Active
                 </div>
                 <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 italic font-bold text-xs text-ink">
                    <Box className="h-3 w-3 text-indigo-400" /> ONNX Graph Runtime: ON
                 </div>
              </div>
           </div>

           <div className="rounded-[40px] bg-indigo-900 p-10 text-white space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                 <BrainCircuit className="size-32" />
              </div>
              <div className="relative space-y-6">
                 <h3 className="text-3xl font-black italic uppercase leading-none">Intelligence Audit.</h3>
                 <p className="text-sm font-medium text-white/50 leading-relaxed max-w-[200px]">
                    Validate all model results against the standard IFRS 9 audit trail before deploying to the core environment.
                 </p>
                 <button className="w-full rounded-[40px] bg-teal py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-teal/20 transition-all hover:bg-teal-600">
                    Run Validation Pipeline
                 </button>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}

