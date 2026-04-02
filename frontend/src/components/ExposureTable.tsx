"use client";

import { useDeferredValue, useMemo, useState } from "react";

import type { Exposure } from "@/lib/types";

type ExposureTableProps = {
  exposures: Exposure[];
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

export function ExposureTable({ exposures }: ExposureTableProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredExposures = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return exposures;
    }

    return exposures.filter((exposure) =>
      [
        exposure.loan_id,
        exposure.customer_name,
        exposure.sector,
        exposure.currency,
        exposure.connected_party_group,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [deferredQuery, exposures]);

  return (
    <section className="surface-card p-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="eyebrow">Loan Book</p>
          <h2 className="section-title text-2xl">Exposure-level IFRS 9 view</h2>
          <p className="section-copy">
            Search by obligor, sector, currency, or connected-party group to inspect modeled risk.
          </p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search exposures"
          className="w-full rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-teal/50 lg:max-w-xs"
        />
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-2 py-3 font-medium">Obligor</th>
              <th className="px-2 py-3 font-medium">Stage</th>
              <th className="px-2 py-3 font-medium">Sector</th>
              <th className="px-2 py-3 font-medium">Exposure</th>
              <th className="px-2 py-3 font-medium">PD</th>
              <th className="px-2 py-3 font-medium">LGD</th>
              <th className="px-2 py-3 font-medium">ECL</th>
            </tr>
          </thead>
          <tbody>
            {filteredExposures.map((exposure) => (
              <tr key={exposure.loan_id} className="border-b border-slate-100 last:border-b-0">
                <td className="px-2 py-4 align-top">
                  <div className="font-medium text-ink">{exposure.customer_name}</div>
                  <div className="font-[family-name:var(--font-mono)] text-xs text-slate-500">
                    {exposure.loan_id} • {exposure.currency} • {exposure.connected_party_group}
                  </div>
                </td>
                <td className="px-2 py-4 align-top">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    Stage {exposure.stage}
                  </span>
                  <div className="mt-2 text-xs text-slate-500">
                    {exposure.days_past_due} DPD
                  </div>
                </td>
                <td className="px-2 py-4 align-top text-slate-700">{exposure.sector}</td>
                <td className="px-2 py-4 align-top font-medium text-ink">
                  {currencyFormatter.format(exposure.outstanding_principal)}
                </td>
                <td className="px-2 py-4 align-top text-slate-700">
                  {numberFormatter.format(exposure.pd * 100)}%
                </td>
                <td className="px-2 py-4 align-top text-slate-700">
                  {numberFormatter.format(exposure.lgd * 100)}%
                </td>
                <td className="px-2 py-4 align-top font-medium text-ember">
                  {currencyFormatter.format(exposure.ecl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

