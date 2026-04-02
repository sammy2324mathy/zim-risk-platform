"use client";

import { useState } from "react";
import { 
  Calculator, 
  Layers, 
  ShieldCheck, 
  Scale, 
  Landmark, 
  ArrowRightCircle, 
  Zap, 
  Briefcase, 
  Network 
} from "lucide-react";

import { ExposureTable } from "@/components/ExposureTable";
// Mock data or API hook would go here in a full implementation

const stages = [
  { id: 1, label: "Stage 1", color: "bg-emerald-500", desc: "Low credit risk / 12m ECL" },
  { id: 2, label: "Stage 2", color: "bg-amber-500", desc: "Significant Increase in credit risk (SICR) / Lifetime ECL" },
  { id: 3, label: "Stage 3", color: "bg-rose-500", desc: "Credit-impaired / Default / Lifetime ECL" },
];

export function ECLCalculatorPage() {
  const [selectedStage, setSelectedStage] = useState(1);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-teal">
          <Calculator className="h-4 w-4" />
          <p className="eyebrow text-teal font-bold tracking-[0.2em]">IFRS 9 COMPLIANCE ENGINE</p>
        </div>
        <h1 className="text-4xl font-extrabold text-ink tracking-tight">Expected Credit Loss Lab.</h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed">
          Integrated actuarial environment for impairment modeling, staging trigger validation, and multi-scenario probability weighting.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
        <div className="space-y-8">
           {/* Section 1: Staging Strategy */}
           <section className="surface-card p-8">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <Layers className="h-5 w-5 text-teal" />
                    <h2 className="text-xl font-bold text-ink">Impairment Staging Framework</h2>
                 </div>
                 <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Config: BASEL_III_ZIM_GAZETTE</span>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-3">
                 {stages.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => setSelectedStage(stage.id)}
                      className={`relative rounded-3xl p-6 text-left transition-all hover:-translate-y-1 ${
                        selectedStage === stage.id 
                          ? "bg-ink text-white ring-8 ring-slate-100" 
                          : "bg-slate-50 border border-slate-100 text-slate-500 hover:border-teal/30"
                      }`}
                    >
                       <div className={`size-3 rounded-full ${stage.color} mb-4`} />
                       <h3 className="font-bold mb-2">{stage.label}</h3>
                       <p className="text-[10px] leading-relaxed opacity-60 font-medium">{stage.desc}</p>
                       {selectedStage === stage.id && (
                         <ArrowRightCircle className="absolute bottom-6 right-6 h-4 w-4 text-teal animate-pulse" />
                       )}
                    </button>
                 ))}
              </div>
           </section>

           {/* Section 2: Scenario Workbench */}
           <section className="surface-card p-8">
              <div className="flex items-center gap-3 mb-8">
                 <ShieldCheck className="h-5 w-5 text-moss" />
                 <h2 className="text-xl font-bold text-ink">Probability-Weighted Simulation</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                 <div className="rounded-[40px] bg-mist border border-slate-100 p-8 space-y-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Scenario Weighting</p>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="font-bold text-ink italic leading-none">Baseline (Central)</span>
                          <span className="text-xl font-black text-ink">50%</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-500 italic leading-none">Upside (Bull)</span>
                          <span className="text-xl font-black text-slate-400">15%</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="font-bold text-ember italic leading-none">Downside (Bear)</span>
                          <span className="text-xl font-black text-ember">35%</span>
                       </div>
                    </div>
                    <button className="w-full rounded-2xl bg-white border border-slate-200 py-3 text-xs font-bold uppercase tracking-wider text-ink transition-all hover:border-teal/40">
                       Re-calibrate Scenarios
                    </button>
                 </div>

                 <div className="space-y-4">
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-3 text-ink">
                          <Scale className="h-4 w-4" />
                          <span className="text-xs font-bold">LGD Floor</span>
                       </div>
                       <span className="text-sm font-black text-teal">35.0%</span>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-3 text-ink">
                          <Zap className="h-4 w-4" />
                          <span className="text-xs font-bold">PD Smoothing</span>
                       </div>
                       <span className="text-sm font-black text-teal italic capitalize">Bayesian</span>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between text-white shadow-xl shadow-slate-900/10">
                       <div className="flex items-center gap-3">
                          <Network className="h-4 w-4 text-teal" />
                          <span className="text-xs font-bold">Portfolio Aggregation</span>
                       </div>
                       <span className="text-xs font-black uppercase text-teal">Enabled</span>
                    </div>
                 </div>
              </div>
           </section>
        </div>

        <aside className="space-y-6">
           <div className="surface-card p-8">
              <div className="flex items-center gap-3 mb-6">
                 <Briefcase className="h-5 w-5 text-teal" />
                 <p className="data-label text-ink">Exposure Summary</p>
              </div>
              <div className="space-y-6">
                 <div>
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Portfolio</p>
                       <span className="text-[10px] font-bold text-teal">Sync: Live</span>
                    </div>
                    <p className="text-3xl font-black text-ink">$241,085,200</p>
                 </div>
                 <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-medium text-slate-500 italic">Stage 1 Coverage</span>
                       <span className="text-sm font-bold text-ink">1.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-medium text-slate-500 italic">Retail ECL Pool</span>
                       <span className="text-sm font-bold text-ink">$4.2M</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-medium text-slate-500 italic">Corporate IFRS 9 Gap</span>
                       <span className="text-sm font-bold text-rose-500">+$1.2M</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="rounded-[40px] bg-teal p-8 text-white space-y-6 shadow-xl shadow-teal/10">
              <div className="flex items-center gap-3 opacity-60">
                 <Landmark className="h-5 w-5" />
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em]">RBZ Disclosure Portal</p>
              </div>
              <p className="text-sm font-medium leading-relaxed">
                 All calculations are auto-mapped to the Central Bank's 05-02-B reporting schema.
              </p>
              <button className="w-full rounded-2xl bg-white/10 border border-white/20 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20">
                 Generate Submission XML
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
}

