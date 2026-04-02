"use client";

import { AlertTriangle, ArrowUpRight, BarChart3, Briefcase, DatabaseZap, FileDown, Landmark, Scale, ShieldAlert, ShieldCheck } from "lucide-react";
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

export function DashboardShell() {
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
      alert("Failed to generate compliance report. Please ensure the backend is running.");
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

  const topSector = useMemo(() => overview?.summary.sector_distribution[0], [overview]);

  if (!overview) {
    return (
      <main className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16">
        <div className="surface-card w-full p-10">
          <p className="eyebrow">Booting Platform</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">
            Loading portfolio analytics and regulatory signals...
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.3fr,0.9fr]">
        <div className="surface-card overflow-hidden p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="eyebrow">Zimbabwe Risk Infrastructure</span>
              <span className="value-chip">Institution: {overview.institution}</span>
              <span className="value-chip">
                Macro confidence: {percentFormatter.format(overview.summary.macro_confidence * 100)}%
              </span>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0"
            >
              <FileDown className="h-4 w-4" />
              Export Compliance Brief
            </button>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-ink lg:text-6xl">
                Compliance, capital, and exposure intelligence built for Zimbabwean banking volatility.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                This foundation build combines IFRS 9 loan staging, stress testing, connected-party exposure monitoring,
                and machine-readable regulatory updates in one operating surface.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="value-chip">Real-time FX overlays</span>
                <span className="value-chip">Connected-party concentration alerts</span>
                <span className="value-chip">Offline-friendly dashboard fallback</span>
              </div>
            </div>
            <div className="rounded-[30px] bg-ink p-5 text-white">
              <p className="data-label text-white/60">Active Macro Scenario</p>
              <h2 className="mt-3 text-2xl font-semibold">{overview.macro_scenario.name}</h2>
              <p className="mt-3 text-sm leading-6 text-white/75">
                {overview.macro_scenario.description}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="data-label text-white/60">ZiG / USD</p>
                  <p className="mt-2 text-2xl font-semibold">{overview.macro_scenario.zig_usd_rate}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="data-label text-white/60">Inflation</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {percentFormatter.format(overview.macro_scenario.inflation_rate * 100)}%
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="data-label text-white/60">Agri Output</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {percentFormatter.format(overview.macro_scenario.agricultural_output_index * 100)}%
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="data-label text-white/60">GDP Growth</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {percentFormatter.format(overview.macro_scenario.gdp_growth * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="surface-card p-6">
            <div className="flex items-center gap-3">
              <DatabaseZap className="h-5 w-5 text-teal" />
              <p className="data-label">Market Inputs</p>
            </div>
            <div className="mt-5 grid gap-3">
              {overview.fx_rates.map((rate) => (
                <div
                  key={`${rate.pair}-${rate.source}`}
                  className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">{rate.pair}</p>
                    <p className="text-sm font-medium text-ember">{rate.rate.toFixed(2)}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {rate.source} • confidence {percentFormatter.format(rate.confidence * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-ember" />
              <p className="data-label">Concentration Alerts</p>
            </div>
            <div className="mt-5 grid gap-3">
              {overview.summary.connected_party_alerts.length > 0 ? (
                overview.summary.connected_party_alerts.map((alert) => (
                  <div key={alert.group} className="rounded-2xl bg-amber-50 px-4 py-4">
                    <p className="font-semibold text-ink">{alert.group}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Exposure {currencyFormatter.format(alert.exposure)} against a threshold of{" "}
                      {currencyFormatter.format(alert.threshold)}.
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-emerald-50 px-4 py-4 text-sm text-slate-600">
                  No connected-party groups currently breach the 15% capital threshold.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Gross Exposure"
          value={currencyFormatter.format(overview.summary.total_exposure)}
          note="Current on-book balance across the consolidated corporate loan portfolio."
          accent="bg-teal"
          icon={Landmark}
        />
        <MetricCard
          label="Expected Credit Loss"
          value={currencyFormatter.format(overview.summary.total_ecl)}
          note="Full-cycle ECL modeling incorporating Zimbabwe-specific macro variables."
          accent="bg-ember"
          icon={ShieldAlert}
          trend={{ value: "+2.4%", isPositive: false }}
        />
        <MetricCard
          label="Capital Ratio"
          value={`${percentFormatter.format(overview.summary.capital_ratio)}%`}
          note="Post-stress capital adequacy based on Basel III / RBZ guidelines."
          accent="bg-moss"
          icon={Scale}
          trend={{ value: "-0.8%", isPositive: false }}
        />
        <MetricCard
          label="Largest Sector"
          value={topSector?.label ?? "N/A"}
          note={
            topSector
              ? `Concentration alert: ${currencyFormatter.format(topSector.amount)} in ${topSector.label}.`
              : "Sector concentration analysis unavailable."
          }
          accent="bg-slate-900"
          icon={Briefcase}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr,0.9fr]">
        <StressPanel
          runs={overview.stress.runs}
          scenarios={overview.stress.scenarios}
          selectedScenarioId={selectedScenarioId}
          onSelectScenario={setSelectedScenarioId}
          onRefresh={refresh}
          activeMacroScenarioId={overview.macro_scenario.scenario_id}
        />
        <RegulatoryTimeline
          updates={overview.regulations.updates}
          rulebook={overview.regulations.rulebook}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr,0.9fr]">
        <ExposureTable exposures={overview.exposures} />

        <div className="grid gap-6">
          <section className="surface-card p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-teal" />
              <p className="data-label">Portfolio Shape</p>
            </div>
            <div className="mt-5 grid gap-3">
              {overview.summary.stage_distribution.map((stage) => (
                <div key={stage.label} className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-ink">{stage.label}</p>
                    <p className="text-sm font-medium text-slate-700">
                      {currencyFormatter.format(stage.amount)}
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal"
                      style={{
                        width: `${Math.min(
                          (stage.amount / overview.summary.total_exposure) * 100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card p-6">
            <div className="flex items-center gap-3">
              <ArrowUpRight className="h-5 w-5 text-ember" />
              <p className="data-label">Top Exposures</p>
            </div>
            <div className="mt-5 grid gap-3">
              {overview.summary.top_exposures.map((exposure) => (
                <article key={exposure.loan_id} className="rounded-2xl bg-mist px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-ink">{exposure.customer_name}</h3>
                      <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-slate-500">
                        {exposure.loan_id} • Stage {exposure.stage}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-ink">
                        {currencyFormatter.format(exposure.exposure)}
                      </p>
                      <p className="text-sm text-ember">
                        ECL {currencyFormatter.format(exposure.ecl)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

