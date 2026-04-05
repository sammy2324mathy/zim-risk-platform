"use client";

import { Activity, AlertTriangle, ArrowUpRight, BarChart3, Briefcase, DatabaseZap, FileDown, Landmark, Scale, ShieldAlert, ShieldCheck, Globe, Lock, Share2, Zap } from "lucide-react";
import { startTransition, useEffect, useMemo, useState } from "react";

import { ExposureTable } from "@/components/ExposureTable";
import { MetricCard } from "@/components/MetricCard";
import { RegulatoryTimeline } from "@/components/RegulatoryTimeline";
import { StressPanel } from "@/components/StressPanel";
import { getDashboardOverview } from "@/api";
import type { DashboardOverview } from "@/types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

export function DashboardHub() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState("");

  const refresh = async () => {
    const data = await getDashboardOverview();
    setOverview(data);
    if (!selectedScenarioId && data.stress.runs.length > 0) {
      setSelectedScenarioId(data.stress.runs[0].scenario_id);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/compliance/report/compliance`);
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ZimRisk_Audit_Brief_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
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
    return () => { cancelled = true; };
  }, []);

  if (!overview) return (
    <div className="flex h-[60vh] items-center justify-center">
       <div className="text-center space-y-4">
          <div className="size-12 bg-slate-50 border border-slate-100 rounded-lg mx-auto flex items-center justify-center animate-pulse">
             <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Synchronizing Hub Signals...</p>
       </div>
    </div>
  );

  const topSector = overview.summary.sector_distribution[0];
  const isRegulator = overview.tenant_id === "RBZ";

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Upper Management Strip */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-2.5 py-1 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${isRegulator ? 'bg-rose-600 text-white shadow-rose-600/20' : 'bg-blue-600 text-white shadow-blue-600/20'}`}>
               {isRegulator ? 'GLOBAL_OVERSIGHT' : 'MISSION_ROOT'}
            </span>
            <div className="flex items-center gap-2 group cursor-help">
               <div className={`size-2 rounded-full animate-pulse ${isRegulator ? 'bg-emerald-500' : 'bg-blue-500'}`} />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest underline decoration-dotted">
                  {isRegulator ? 'National Perspective: ACTIVE' : 'Standalone Mode: INDEPENDENT_SOVEREIGN'}
               </span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic underline decoration-blue-600/10">Portfolio_Hub.</h1>
          <p className="mt-4 text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
             {isRegulator 
               ? "Consolidated national telemetry for cross-institutional systemic risk detection and capital adequacy auditing."
               : `Authorized institutional workstation for ${overview.institution}. Operationalizing statutory IFRS 9 staging and localized stress shocks.`
             }
          </p>
        </div>
        <div className="flex items-center gap-4 min-w-[300px]">
            {!isRegulator && (
               <div className="p-4 rounded-sm bg-slate-50 border border-slate-100 flex items-center gap-4 flex-1">
                  <div className="size-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                     <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Peer Isolation</p>
                     <p className="text-[10px] font-black text-slate-900 uppercase">Vault_Locked</p>
                  </div>
               </div>
            )}
            <div className="h-10 w-px bg-slate-200 mx-2" />
            <button
               onClick={handleExport}
               className="h-14 px-8 rounded-sm bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98]"
            >
               <FileDown className="h-5 w-5 text-blue-500" />
               Institutional Brief_
            </button>
        </div>
      </header>

      {/* Metric Grid */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Gross Exposure", val: currencyFormatter.format(overview.summary.total_exposure), icon: Landmark, color: "text-slate-900", sub: "Total institutional asset base" },
          { label: isRegulator ? "Systemic ECL" : "Institutional ECL", val: currencyFormatter.format(overview.summary.total_ecl), icon: ShieldAlert, color: "text-rose-600", trend: "+$2.4M DRIFT" },
          { label: "Capital Adequacy", val: `${percentFormatter.format(overview.summary.capital_ratio)}%`, icon: Scale, color: "text-emerald-600", trend: "0.8% HEADROOM" },
          { label: "Sector_Cluster", val: topSector?.label ?? "N/A", icon: Briefcase, color: "text-blue-600", sub: "Leading Asset Segment" }
        ].map((m) => (
          <div key={m.label} className="surface-card p-10 border-t-4 border-t-slate-100 hover:border-t-blue-600 transition-all group shadow-xl shadow-slate-900/5 bg-white italic relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] size-32 bg-slate-50 rounded-full blur-3xl opacity-0 px-10 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors">
                <m.icon className="h-5 w-5 text-slate-400" />
              </div>
              {m.trend && (
                <span className={`text-[10px] font-mono font-black ${m.trend.includes('DRIFT') ? 'text-rose-500' : 'text-emerald-500'}`}>{m.trend}</span>
              )}
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 relative z-10">{m.label}</p>
            <p className={`text-3xl font-black ${m.color} tracking-tighter leading-none mb-3 font-mono relative z-10 underline decoration-current/5`}>{m.val}</p>
            {m.sub && <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest relative z-10">{m.sub}</p>}
          </div>
        ))}
      </section>

      {/* Middle Operation Strip (standalone context indicator) */}
      {!isRegulator && (
         <section className="p-10 rounded-2xl bg-blue-600 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            <div className="size-20 bg-white/10 rounded-full flex items-center justify-center shrink-0">
               <Globe className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2 flex-1 text-center md:text-left">
               <h3 className="text-2xl font-black uppercase tracking-tight italic select-none">Independent_Operating_OS</h3>
               <p className="text-sm font-bold text-blue-100 max-w-xl italic leading-none">
                  Institutional Sovereign Mode Active. This node is currently operating independently of the National Regulatory Hub. No systemic oversight detected.
               </p>
            </div>
            <button className="h-12 px-6 rounded bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-blue-950/20">
               <Share2 className="h-4 w-4" />
               Authorize Statutory Bridge_
            </button>
         </section>
      )}

      {/* Operational Surfaces */}
      <section className="grid gap-12 xl:grid-cols-[1.5fr,1fr]">
        <div className="space-y-12">
           <div className="surface-card p-0 rounded-2xl border-2 border-slate-100 overflow-hidden bg-white shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 italic underline decoration-blue-500/30">Portfolio_Staging_Artifacts [IFRS_9]</h3>
                 <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest cursor-pointer hover:underline underline-offset-4 decoration-2">Workspace Detail →</span>
              </div>
              <div className="p-10">
                 <ExposureTable exposures={overview.exposures} />
              </div>
           </div>
           
           <StressPanel
             runs={overview.stress.runs}
             scenarios={overview.stress.scenarios}
             selectedScenarioId={selectedScenarioId}
             onSelectScenario={setSelectedScenarioId}
             onRefresh={refresh}
             activeMacroScenarioId={overview.macro_scenario.scenario_id}
           />
        </div>

        <div className="space-y-8">
           <RegulatoryTimeline
             updates={overview.regulations.updates}
             rulebook={overview.regulations.rulebook}
           />

           <div className="surface-card p-0 border-2 border-slate-100">
             <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 italic">Major_Exposure_Telemetry</h3>
                <span className="text-[10px] font-mono font-black text-slate-400 uppercase">ARTIFACT_HUB</span>
             </div>
             <div className="p-8 space-y-4">
                {overview.summary.top_exposures.map((exposure) => (
                  <div key={exposure.loan_id} className="flex items-center justify-between p-6 rounded border border-slate-100 bg-slate-50/20 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-crosshair group italic">
                     <div>
                       <p className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{exposure.customer_name}</p>
                       <p className="text-[9px] font-mono font-bold text-slate-400">ID: {exposure.loan_id} • STAGE_{exposure.stage}</p>
                     </div>
                     <p className="text-base font-mono font-black text-slate-900 leading-none">{currencyFormatter.format(exposure.exposure)}</p>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
