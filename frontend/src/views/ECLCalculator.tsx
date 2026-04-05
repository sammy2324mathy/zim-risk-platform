"use client";

import { useState, useEffect, startTransition } from "react";
import { 
  Calculator, 
  ArrowRight, 
  BarChart4, 
  PieChart, 
  FileSearch, 
  Filter, 
  ArrowDownToLine, 
  Trash2, 
  Undo,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertCircle
} from "lucide-react";

import { getDashboardOverview, updateLoanStage } from "@/api";
import type { DashboardOverview, Exposure } from "@/types";

export function ECLCalculator() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [selectedSector, setSelectedSector] = useState("All");
  const [stagingBatch, setStagingBatch] = useState<Record<string, number>>({});
  const [syncing, setSyncing] = useState(false);

  const fetchData = async () => {
    const data = await getDashboardOverview();
    setOverview(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredExposures = overview?.exposures.filter(e => 
    selectedSector === "All" || e.sector === selectedSector
  ) || [];

  const handleStageChange = async (loanId: string, newStage: number) => {
    // Optimistic UI update for the batch list
    setStagingBatch(prev => ({ ...prev, [loanId]: newStage }));
  };

  const handleFinalize = async () => {
    setSyncing(true);
    try {
      for (const [loanId, stage] of Object.entries(stagingBatch)) {
        await updateLoanStage(loanId, stage);
      }
      setStagingBatch({});
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  // Dynamic Impact Calculation (Simplified for UI feedback)
  const stagedCount = Object.keys(stagingBatch).length;
  const incrementalECL = stagedCount * 125000; // Mock drift per stage change
  const capitalRetention = (overview?.summary.total_exposure || 0) * 0.148 - incrementalECL;

  if (!overview) return (
    <div className="flex h-[60vh] items-center justify-center">
       <div className="text-center space-y-4">
          <div className="size-12 bg-blue-50 border border-blue-100 rounded-lg mx-auto flex items-center justify-center animate-pulse">
             <Calculator className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Establishing IFRS 9 Staging Context...</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Workshop Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="size-10 bg-slate-900 rounded-sm flex items-center justify-center text-white shadow-lg">
                <Calculator className="h-5 w-5" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">IFRS 9 OPERATIONAL DESK</p>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic underline decoration-blue-600/30">ECL_Workshop.</h1>
          <p className="text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
            Authorized workstation for manual staging overrides, collateral HAIR_C_CUT analysis, and real-time capital impact modeling (SICR Detection).
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Platform Integrity</p>
              <p className="text-xl font-black text-emerald-600 font-mono leading-none flex items-center gap-2">
                 <ShieldCheck className="h-4 w-4" />
                 SYNCED
              </p>
           </div>
           <div className="h-10 w-px bg-slate-200 mx-2" />
            <button 
              onClick={handleFinalize}
              disabled={stagedCount === 0 || syncing}
              className="h-12 px-6 rounded-sm bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-600/10 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {syncing ? (
                 <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                 <ArrowDownToLine className="h-4 w-4" />
              )}
              Finalize Staging Batch ({stagedCount})
            </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="grid gap-12 xl:grid-cols-[2.5fr,1fr]">
        <div className="space-y-10">
           {/* Section 1: Portfolio Staging Filter */}
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-sm">
                    <Filter className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Sector Portfolio:</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {["All", "Agriculture", "Mining", "Manufacturing", "Retail"].map((s) => (
                      <button 
                        key={s}
                        onClick={() => setSelectedSector(s)}
                        className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedSector === s ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-inner' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                      >
                         {s}
                      </button>
                    ))}
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Artifacts</p>
                 <p className="text-xl font-black text-slate-900 font-mono leading-none">{filteredExposures.length}</p>
              </div>
           </div>

           {/* Section 2: Staging Table */}
           <div className="surface-card p-0 border-2 border-slate-100 overflow-hidden bg-white shadow-xl shadow-slate-900/5">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-slate-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Institutional Exposure List</h3>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">Batch Select Mode: OFF</span>
                    <button className="p-1 px-2 border border-slate-200 rounded text-[9px] font-black uppercase text-slate-400 hover:bg-white transition-colors">Select All</button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse font-sans italic">
                    <thead>
                       <tr className="bg-slate-50/50">
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-100">Loan ID</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-100">Customer Identity</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-100">Exposure_Principal</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-100">Active_Stage</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-100">PD_Weight</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Action: Restaging</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredExposures.map((e) => (
                          <tr key={e.loan_id} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors border-r border-slate-100 italic">{e.loan_id.replace("CABS-", "").replace("ECO-", "")}</td>
                             <td className="px-6 py-4">
                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{e.customer_name}</p>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{e.sector}</p>
                             </td>
                             <td className="px-6 py-4 font-mono text-[11px] font-black text-slate-900 border-r border-slate-100">
                                ${(e.ead/1000000).toFixed(2)}M
                             </td>
                              <td className="px-6 py-4 border-r border-slate-100">
                                <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black font-mono border ${
                                   (stagingBatch[e.loan_id] || e.stage) === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                   (stagingBatch[e.loan_id] || e.stage) === 2 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                   'bg-rose-50 text-rose-600 border-rose-100'
                                }`}>
                                   STAGE_{(stagingBatch[e.loan_id] || e.stage)}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900 border-r border-slate-100 italic">
                                 {(e.pd * 100).toFixed(2)}%
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {[1, 2, 3].map((s) => (
                                       <button 
                                         key={s}
                                         onClick={() => handleStageChange(e.loan_id, s)}
                                         className={`size-6 rounded-sm flex items-center justify-center text-[10px] font-black border transition-all ${(stagingBatch[e.loan_id] || e.stage) === s ? 'hidden' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600 active:scale-90'}`}
                                       >
                                          S{s}
                                       </button>
                                    ))}
                                   <button className="size-6 rounded-sm flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all">
                                      <Trash2 className="h-3 w-3" />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Impact Panel */}
        <aside className="space-y-10">
           <div className="surface-card p-10 bg-slate-950 text-white rounded-2xl border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#3b82f6_0.5px,_transparent_0.5px)] bg-[size:10px_10px] pointer-events-none" />
              <div className="relative z-10 space-y-10">
                 <div className="flex items-center gap-3">
                    <BarChart4 className="h-5 w-5 text-blue-500" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 italic underline decoration-blue-500/50">Capital_Impact_Analyzer.</h2>
                 </div>
                 
                 <div className="space-y-8">
                    {[
                       { label: "Incremental ECL", value: incrementalECL, trend: "up", icon: TrendingUp, color: "text-rose-400" },
                       { label: "Capital_Retention", value: capitalRetention, trend: "down", icon: TrendingDown, color: "text-emerald-400" },
                    ].map((m) => (
                       <div key={m.label} className="space-y-2 group/metric">
                          <div className="flex items-center justify-between">
                             <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{m.label}</p>
                             <m.icon className={`h-3 w-3 ${m.color}`} />
                          </div>
                          <p className={`text-4xl font-black font-mono tracking-tighter ${m.color} italic leading-none`}>
                             {m.value < 0 ? '-' : '+'}${(Math.abs(m.value)/1000000).toFixed(2)}M
                          </p>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest group-hover/metric:text-white/40 transition-colors">Projected Drift for Staging Batch_</p>
                       </div>
                    ))}
                 </div>

                 <div className="pt-10 border-t border-white/10 space-y-6">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-white/40 italic underline">Platform Recovery:</span>
                       <span className="text-emerald-500 underline decoration-2 underline-offset-4">{(overview.summary.capital_ratio * (1 - incrementalECL/(overview.summary.total_exposure*0.1))).toFixed(1)}% CAR_MIN</span>
                    </div>
                    <button className="w-full h-14 bg-blue-600 rounded-sm text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:bg-blue-500">
                       <Zap className="h-4 w-4" />
                       Perform Global Audit Sync
                    </button>
                 </div>
              </div>
           </div>

           <div className="surface-card p-10 space-y-8 bg-white border-2 border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                 <Info className="h-4 w-4 text-blue-600" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">IFRS 9 Guidance: SICR_Signals</h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                 Sector default weights for <span className="text-slate-900 font-bold italic underline decoration-blue-500/30">SICR Determination</span> are currently adjusted for the ZiG inflation corridor.
              </p>
              <div className="space-y-4 pt-4 border-t border-slate-100">
                 {[
                   { label: "Mining Sector", val: "Lo-Risk [7.2%]", color: "bg-emerald-50 text-emerald-600" },
                   { label: "Agri Portfolio", val: "Hi-Risk [18.4%]", color: "bg-rose-50 text-rose-600" },
                 ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                       <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase tracking-widest ${s.color}`}>{s.val}</span>
                    </div>
                 ))}
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
