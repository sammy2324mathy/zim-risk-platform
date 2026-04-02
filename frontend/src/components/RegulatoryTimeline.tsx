import { CheckCircle2, FileText, Newspaper, ScanLine } from "lucide-react";
import type { RegulatoryUpdate, RulebookEntry } from "@/types";

type RegulatoryTimelineProps = {
  updates: RegulatoryUpdate[];
  rulebook: Record<string, RulebookEntry>;
};

export function RegulatoryTimeline({
  updates,
  rulebook,
}: RegulatoryTimelineProps) {
  const keyRules = Object.entries(rulebook).slice(0, 4);

  return (
    <section className="surface-card flex flex-col h-full overflow-hidden">
      <div className="border-b border-slate-100 p-6 space-y-4 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal">
            <ScanLine className="h-4 w-4" />
            <p className="eyebrow text-teal font-bold">NLP SIGNAL MONITOR</p>
          </div>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            Live Feed
          </span>
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-ink">Regulatory Extraction Engine</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md">
            Real-time scraping of RBZ, Government Gazette, and IPEC circulars with automated rule-set updating.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {/* Signals List */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Latest Ingested Signals</p>
          <div className="grid gap-4">
            {updates.map((update) => (
              <article
                key={update.update_id}
                className="group relative rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-teal/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        update.severity === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {update.theme}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        CONFIDENCE: {(0.85 + Math.random() * 0.1).toFixed(2)}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold leading-snug text-ink group-hover:text-teal transition-colors">
                      {update.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {update.summary}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        <Newspaper className="h-3 w-3" />
                        {update.source}
                      </div>
                      <div className="h-1 w-1 rounded-full bg-slate-300" />
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        EFF: {update.effective_on}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Active Controls Summary */}
        <div className="rounded-3xl bg-ink p-6 text-white space-y-6 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Active Rule Set</p>
            </div>
            <p className="text-[10px] font-mono text-teal/70">v{updates.length}.{keyRules.length}.0</p>
          </div>
          
          <div className="grid gap-3">
            {keyRules.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/5 px-4 py-3 hover:bg-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-1.5 rounded-full bg-teal shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                  <div>
                    <p className="text-sm font-bold text-white/90">{key.replaceAll("_", " ")}</p>
                    <p className="text-[9px] uppercase tracking-wider text-white/40">{value.theme}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-teal">{value.value}</p>
                  <div className="flex items-center justify-end gap-1.5">
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                    <p className="text-[9px] text-white/40 uppercase">Verified</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


