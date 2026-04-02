"use client";

import { useState } from "react";
import { 
  Calculator, 
  ArrowLeft, 
  Save, 
  FileDown, 
  ChevronRight, 
  Activity, 
  BarChart3, 
  Globe, 
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Layers,
  Scale,
  Zap,
  Network
} from "lucide-react";

import { ExposureTable } from "@/components/ExposureTable";

export function ECLCalculatorPage() {
  const [activeStage, setActiveStage] = useState(1);

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between bg-white/50 p-6 rounded-[40px] border border-white">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <button className="p-3 rounded-full hover:bg-white transition-all text-slate-400">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 text-teal">
                <Calculator className="h-4 w-4" />
                <p className="eyebrow text-teal font-bold tracking-[0.2em]">ACTUARIAL_WORKBENCH_V4</p>
              </div>
           </div>
           <h1 className="text-4xl font-extrabold text-ink tracking-tight">IFRS 9 ECL Calculator.</h1>
        </div>
        <div className="flex items-center gap-4">
           <button className="h-14 px-8 rounded-full border border-slate-200 bg-white text-ink font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-slate-50 transition-all">
              <Save className="h-4 w-4 text-emerald-500" /> Save Analysis
           </button>
           <button className="h-14 px-8 rounded-full bg-ink text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl shadow-ink/20 hover:translate-y-[-2px] transition-all">
              <FileDown className="h-4 w-4" /> Export Report
           </button>
        </div>
      </header>

      {/* Portfolio Selection Bar */}
      <section className="surface-card p-10 bg-ink text-white rounded-[40px] shadow-2xl">
         <div className="grid gap-10 md:grid-cols-4 items-end">
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Portfolio Entity</label>
               <select className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-teal/30 appearance-none">
                  <option>Corporate Loans</option>
                  <option>SME Portfolios</option>
                  <option>Retail & Mortgages</option>
                  <option>Agricultural Assets</option>
               </select>
            </div>
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Reporting Period</label>
               <select className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-teal/30">
                  <option>2026-03-31 (Q1 Close)</option>
                  <option>2025-12-31 (Year End)</option>
               </select>
            </div>
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Reporting Currency</label>
               <select className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-teal/30">
                  <option>USD (United States Dollar)</option>
                  <option>ZiG (Zimbabwe Gold)</option>
               </select>
            </div>
            <button className="h-14 w-full bg-teal text-ink font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-teal-600 transition-all flex items-center justify-center gap-3">
               Run Full ECL Analysis <ChevronRight className="h-4 w-4" />
            </button>
         </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.5fr,0.9fr]">
         <div className="space-y-10">
            {/* ECL Breakdown Dashboard */}
            <div className="grid gap-6 md:grid-cols-2">
               <section className="surface-card p-10 space-y-8">
                  <div className="flex items-center gap-3">
                     <BarChart3 className="h-5 w-5 text-indigo-500" />
                     <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Impairment Staging Distribution</h3>
                  </div>
                  <div className="space-y-8">
                     <div className="space-y-3 group cursor-pointer" onClick={() => setActiveStage(1)}>
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold italic leading-none">Stage 1 (Performing)</span>
                           <span className="text-xl font-black text-ink">65%</span>
                        </div>
                        <div className="h-3 w-full bg-mist rounded-full overflow-hidden">
                           <div className="h-full w-[65%] bg-emerald-500 transition-all group-hover:opacity-80" />
                        </div>
                     </div>
                     <div className="space-y-3 group cursor-pointer" onClick={() => setActiveStage(2)}>
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold italic leading-none">Stage 2 (Watchlist)</span>
                           <span className="text-xl font-black text-ink">22%</span>
                        </div>
                        <div className="h-3 w-full bg-mist rounded-full overflow-hidden">
                           <div className="h-full w-[22%] bg-amber-500 transition-all group-hover:opacity-80" />
                        </div>
                     </div>
                     <div className="space-y-3 group cursor-pointer" onClick={() => setActiveStage(3)}>
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold italic leading-none">Stage 3 (Non-Performing)</span>
                           <span className="text-xl font-black text-ink">13%</span>
                        </div>
                        <div className="h-3 w-full bg-mist rounded-full overflow-hidden">
                           <div className="h-full w-[13%] bg-rose-500 transition-all group-hover:opacity-80" />
                        </div>
                     </div>
                  </div>
               </section>

               <section className="surface-card p-10 space-y-10 bg-slate-900 text-white shadow-2xl shadow-slate-900/20">
                  <div className="flex items-center gap-3">
                     <Activity className="h-5 w-5 text-teal" />
                     <h3 className="text-sm font-black uppercase tracking-widest text-white/30">Total ECL Breakdown</h3>
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Stage 1 (12-Month)</span>
                        <span className="text-lg font-black">$1,245,000</span>
                     </div>
                     <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Stage 2 (Lifetime)</span>
                        <span className="text-lg font-black">$2,890,000</span>
                     </div>
                     <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Stage 3 (Lifetime + Imp)</span>
                        <span className="text-lg font-black">$5,120,000</span>
                     </div>
                     <div className="flex items-center justify-between pt-4">
                        <span className="text-xs font-black uppercase tracking-widest text-teal">TOTAL PORTFOLIO ECL</span>
                        <span className="text-4xl font-black text-teal tracking-tighter">$9,255,000</span>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Portfolio Coverage Ratio</p>
                        <p className="text-2xl font-black">4.2%</p>
                     </div>
                  </div>
               </section>
            </div>

            <section className="surface-card p-0 overflow-hidden">
               <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold italic text-ink">ECL Risk Contribution Ledger.</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Top 10 Largest Contributors (By Impairment Impact)</p>
                  </div>
                  <button className="px-6 py-3 rounded-full bg-mist text-ink text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Full Portfolio Export</button>
               </div>
               <ExposureTable exposures={[]} />
            </section>
         </div>

         <aside className="space-y-8">
            <div className="surface-card p-10 space-y-10">
               <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-ink leading-none">Macroeconomic Scenario Weights</h3>
               </div>
               
               <div className="space-y-10">
                  <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 space-y-4 transition-all hover:bg-slate-100/50">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="size-4 rounded-full bg-indigo-500" />
                           <span className="font-bold text-ink italic leading-none">Baseline Case</span>
                        </div>
                        <span className="text-xl font-black text-ink">50%</span>
                     </div>
                     <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
                        "GDP growth steady at 3%, Inflation maintained at 35%, XiG exchange stability sustained."
                     </p>
                  </div>

                  <div className="p-6 rounded-[32px] border border-slate-100 space-y-4 transition-all hover:bg-slate-50">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 opacity-50">
                           <div className="size-4 rounded-full bg-emerald-500" />
                           <span className="font-bold text-ink italic leading-none">Upside Scenario</span>
                        </div>
                        <span className="text-xl font-black text-ink opacity-30">25%</span>
                     </div>
                     <p className="text-[10px] font-medium text-slate-300 leading-relaxed italic">
                        "GDP growth acceleration to 5%, Regional trade surge, Harvest surplus."
                     </p>
                  </div>

                  <div className="p-6 rounded-[32px] border border-slate-100 space-y-4 transition-all hover:bg-slate-50">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 opacity-50">
                           <div className="size-4 rounded-full bg-rose-500" />
                           <span className="font-bold text-ink italic leading-none">Severe Downturn</span>
                        </div>
                        <span className="text-xl font-black text-ink opacity-30">25%</span>
                     </div>
                     <p className="text-[10px] font-medium text-slate-300 leading-relaxed italic">
                        "Currency shock -40%, Drought impact on agri-loans, Global commodity crash."
                     </p>
                  </div>
               </div>

               <button className="w-full h-14 rounded-2xl bg-mist text-ink text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all">
                  Edit Scenario Parameters
               </button>
            </div>

            <section className="surface-card p-10 space-y-8">
               <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-ink leading-none">Probability-Weighted Simulation</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-3 text-ink">
                        <Scale className="h-4 w-4" />
                        <span className="text-xs font-bold font-italic">LGD Floor</span>
                     </div>
                     <span className="text-sm font-black text-teal">35.0%</span>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-3 text-ink">
                        <Zap className="h-4 w-4" />
                        <span className="text-xs font-bold font-italic">PD Smoothing</span>
                     </div>
                     <span className="text-sm font-black text-teal italic capitalize">Bayesian</span>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between text-white shadow-xl shadow-slate-900/10">
                     <div className="flex items-center gap-3">
                        <Network className="h-4 w-4 text-teal" />
                        <span className="text-xs font-bold font-italic">Portfolio Aggregation</span>
                     </div>
                     <span className="text-xs font-black uppercase text-teal">Enabled</span>
                  </div>
               </div>
            </section>
         </aside>
      </div>
    </div>
  );
}
