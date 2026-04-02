"use client";

import { useMemo, useState, useEffect, startTransition } from "react";
import { 
  Landmark, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  ChevronRight, 
  Database, 
  Globe, 
  Landmark, 
  Zap, 
  ShieldAlert,
  ArrowUpRight,
  Plus
} from "lucide-react";

import { MetricsCard } from "@/components/MetricsCard";
import { PortfolioHeatmap } from "@/components/PortfolioHeatmap";
import { RegulatoryTimeline } from "@/components/RegulatoryTimeline";
import { StressPanel } from "@/components/StressPanel";
import { ConnectedPartyAlerts } from "@/components/ConnectedPartyAlerts";
import { ExposureTable } from "@/components/ExposureTable";
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

export function DashboardPage() {
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
      cancelled = true;
    };
  }, []);

  const handleExport = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/compliance/report/compliance`);
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ZimRisk_ComplianceBrief_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to generate compliance report.");
    }
  };

  const topSector = useMemo(() => overview?.summary.sector_distribution[0], [overview]);

  if (!overview) return (
    <div className="flex h-[80vh] items-center justify-center">
       <div className="text-center space-y-4">
          <div className="size-12 bg-mist rounded-2xl mx-auto flex items-center justify-center animate-pulse">
             <div className="size-6 bg-teal rounded-full" />
          </div>
          <p className="eyebrow animate-pulse">Booting Risk Operating System</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-16">
      {/* Premium Page Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <span className="eyebrow bg-ink/5 px-2 py-1 rounded">ZIM RISK INFRASTRUCTURE</span>
              <span className="value-chip border-teal/20 text-teal">{overview.institution}</span>
           </div>
           <h1 className="text-4xl font-extrabold tracking-tight text-ink lg:text-6xl">
              Financial Risk Operating System.
           </h1>
           <p className="text-base text-slate-500 max-w-3xl leading-relaxed">
              Consolidated intelligence layer for IFRS 9 ECL staging, Monte Carlo stress resilience, and machine-readable regulatory compliance.
           </p>
        </div>
        <button
          onClick={handleExport}
          className="group flex items-center gap-2 rounded-2xl bg-ink px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-slate-800 hover:-translate-y-1 shadow-xl shadow-ink/10"
        >
          <FileDown className="h-5 w-5" />
          Export Compliance Brief
        </button>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.5fr,0.9fr]">
        <div className="grid gap-6">
           {/* Summary Metrics */}
           <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Gross Exposure"
              value={currencyFormatter.format(overview.summary.total_exposure)}
              note="Full-portfolio consolidated exposure across all branches."
              accent="bg-teal"
              icon={Landmark}
            />
            <MetricCard
              label="Expected Loss"
              value={currencyFormatter.format(overview.summary.total_ecl)}
              note="Full-cycle IFRS 9 ECL projection including shocks."
              accent="bg-ember"
              icon={ShieldAlert}
              trend={{ value: "+2.4%", isPositive: false }}
            />
            <MetricCard
              label="Capital ADEQ"
              value={`${percentFormatter.format(overview.summary.capital_ratio)}%`}
              note="Post-stress capital adequacy under Basel III rules."
              accent="bg-moss"
              icon={Scale}
              trend={{ value: "-0.8%", isPositive: false }}
            />
            <MetricCard
              label="Largest Sector"
              value={topSector?.label ?? "N/A"}
              note={topSector ? `Peak concentration in ${topSector.label}.` : "-"}
              accent="bg-slate-900"
              icon={Briefcase}
            />
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

        <div className="grid gap-6 auto-rows-min">
           <div className="surface-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <DatabaseZap className="h-5 w-5 text-teal" />
              <p className="data-label text-ink">Global Market Feeds</p>
            </div>
            <div className="grid gap-3">
              {overview.fx_rates.map((rate) => (
                <div key={`${rate.pair}-${rate.source}`} className="rounded-2xl border border-slate-100 bg-white/50 px-4 py-4 flex items-center justify-between transition-hover hover:border-teal/20">
                    <div>
                       <p className="font-bold text-ink italic leading-none">{rate.pair}</p>
                       <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-widest">{rate.source}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-bold text-ember">{rate.rate.toFixed(2)}</p>
                       <p className="text-[10px] text-emerald-500 font-bold uppercase">CONF {(rate.confidence * 100).toFixed(0)}%</p>
                    </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-5 w-5 text-ember" />
              <p className="data-label text-ink">Concentration Alerts</p>
            </div>
            <div className="grid gap-3">
              {overview.summary.connected_party_alerts.length > 0 ? (
                overview.summary.connected_party_alerts.map((alert) => (
                  <div key={alert.group} className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                    <p className="text-sm font-bold text-ink mb-1">{alert.group}</p>
                    <p className="text-xs text-amber-700 leading-relaxed font-medium">
                      Exposure {currencyFormatter.format(alert.exposure)} violates 15% threshold.
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-xs font-medium text-emerald-700 flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3" />
                  No connected-party groups currently breach limits.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr,0.9fr]">
         <div className="grid gap-6">
            <ExposureTable exposures={overview.exposures} />
            <section className="surface-card p-8">
               <div className="flex items-center gap-3 mb-8">
                  <ArrowUpRight className="h-5 w-5 text-ember" />
                  <p className="data-label text-ink uppercase tracking-widest">Top Exposures by ECL Risk</p>
               </div>
               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {overview.summary.top_exposures.map((exposure) => (
                    <article key={exposure.loan_id} className="rounded-2xl bg-mist border border-slate-100 p-6 space-y-4 hover:border-teal/30 transition-all transition-hover">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          exposure.stage === 3 ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'
                        }`}>STAGE {exposure.stage}</span>
                        <span className="text-[10px] font-mono text-slate-300 font-bold uppercase"># {exposure.loan_id.slice(-6).toUpperCase()}</span>
                      </div>
                      <h3 className="font-bold text-ink leading-tight h-10 line-clamp-2">{exposure.customer_name}</h3>
                      <div className="pt-4 border-t border-slate-200/50">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Exposure</p>
                         <p className="text-xl font-extrabold text-ink">{currencyFormatter.format(exposure.exposure)}</p>
                         <p className="text-[10px] font-bold text-ember mt-2 uppercase tracking-widest">Predicted ECL: {currencyFormatter.format(exposure.ecl)}</p>
                      </div>
                    </article>
                  ))}
               </div>
            </section>
         </div>

         <div className="grid gap-6 auto-rows-max">
            <RegulatoryTimeline 
              updates={overview.regulations.updates} 
              rulebook={overview.regulations.rulebook} 
            />
            <div className="rounded-[40px] bg-slate-900 p-8 text-white space-y-6">
               <div className="flex items-center gap-3 opacity-50">
                  <ShieldCheck className="h-5 w-5 text-teal" />
                  <p className="eyebrow text-white text-[10px] uppercase font-bold tracking-[0.2em]">Active Compliance Stamp</p>
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-bold">IFRS 9 Regulatory Audit Ready</h3>
                  <p className="text-sm text-white/50 leading-relaxed font-medium">
                     Current risk datasets are synchronized with Statutory Instrument 142/2019 and RBZ Basel III disclosure formats.
                  </p>
               </div>
               <div className="pt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-teal border border-teal/20">RBZ Compliant</span>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40">IPEC Sync Active</span>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

