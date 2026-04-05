"use client";

import { BrainCircuit, Activity, Database, Zap, TrendingUp, ShieldCheck, Cpu, History, ChevronRight } from "lucide-react";

export function MLDevelopment() {
   return (
      <div className="space-y-12 pb-20 font-sans">
         <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="size-10 bg-slate-900 rounded-sm flex items-center justify-center text-white">
                     <BrainCircuit className="h-6 w-6" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Model_Intelligence_Lab</p>
               </div>
               <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic underline decoration-blue-600/20">ML_Workbench.</h1>
               <p className="text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
                  Deep-learning workbench for PD/LGD curve calibration, model drift monitoring, and back-testing against historical Zimbabwean default clusters.
               </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Compute_Status</p>
                  <p className="text-xl font-black text-emerald-600 font-mono leading-none">94.2% OPTIMIZED</p>
               </div>
               <div className="h-10 w-px bg-slate-200 mx-2" />
               <button className="h-12 px-6 rounded-sm bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98]">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  Re-train Artifacts_
               </button>
            </div>
         </header>

         <div className="grid gap-12 lg:grid-cols-[1.5fr,1fr]">
            <section className="space-y-12">
               <div className="surface-card p-12 bg-white border-2 border-slate-100 italic space-y-8">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Drift_Telemetry: PD_CURVE_2026</h3>
                     </div>
                     <span className="text-[9px] font-mono text-slate-400 tracking-widest">v4.1.0-STABLE</span>
                  </div>
                  <div className="h-64 bg-slate-50 rounded border border-slate-100 flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(circle_at_center,_#3b82f6_1px,_transparent_1px)] bg-[size:20px_20px]" />
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Interactive_Simulation_Graph_Placeholder</p>
                  </div>
               </div>
            </section>
            <aside className="space-y-10">
               <div className="surface-card p-10 bg-slate-950 text-white rounded-2xl border-white/5 space-y-10 shadow-2xl">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Model_Integrity_Audit</h4>
                  </div>
                  <div className="space-y-6">
                     {[
                        { label: "Gini Coefficient", val: "0.84", status: "Optimal" },
                        { label: "Kolmogorov-Smirnov", val: "42.2", status: "Stable" },
                     ].map((m) => (
                        <div key={m.label} className="flex items-center justify-between py-4 border-b border-white/10">
                           <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{m.label}</span>
                           <span className="text-xl font-black text-white font-mono">{m.val}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </aside>
         </div>
      </div>
   );
}
