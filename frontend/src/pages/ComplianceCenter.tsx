"use client";

import { useState, useEffect, startTransition } from "react";
import { 
  ShieldCheck, 
  Search, 
  FileText, 
  Filter, 
  Newspaper, 
  Calendar, 
  ArrowUpRight 
} from "lucide-react";

import { RegulatoryTimeline } from "@/components/RegulatoryTimeline";
import { getDashboardOverview } from "@/api";
import type { DashboardOverview } from "@/types";

export function ComplianceCenterPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    let cancelled = false;
    startTransition(() => {
      void getDashboardOverview().then((data) => {
        if (cancelled) return;
        setOverview(data);
      });
    });
    return () => {
      cancelled = false;
    };
  }, []);

  if (!overview) return (
    <div className="flex h-[60vh] items-center justify-center">
       <div className="text-center space-y-4">
          <div className="size-12 bg-mist rounded-2xl mx-auto flex items-center justify-center animate-pulse">
             <ShieldCheck className="h-6 w-6 text-teal" />
          </div>
          <p className="eyebrow">Scraping Regulatory Signals...</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-teal">
          <ShieldCheck className="h-4 w-4" />
          <p className="eyebrow text-teal font-bold tracking-[0.2em]">RBZ & IPEC SIGNAL CENTER</p>
        </div>
        <h1 className="text-4xl font-extrabold text-ink tracking-tight">Regulatory Intelligence Center.</h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed">
          Automated NLP ingestion for Government Gazettes, RBZ circulars, and statutory instruments. Machine-readability for the Rule 05-02B audit framework.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr, 1.2fr]">
        <div className="space-y-8">
           {/* Section 1: Semantic Search */}
           <section className="surface-card p-10 space-y-8 bg-ink text-white">
              <div className="space-y-2">
                 <h2 className="text-2xl font-bold">Semantic Search & Rule Extraction</h2>
                 <p className="text-sm text-white/50 leading-relaxed max-w-md">
                    Search through thousands of historical circulars and gazettes using LLM-powered context awareness.
                 </p>
              </div>
              
              <div className="relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                 <input 
                   placeholder="e.g., SI 142 of 2019 currency conversion rules" 
                   className="w-full h-16 rounded-3xl bg-white/5 border border-white/10 pl-16 pr-6 text-sm font-medium focus:ring-2 focus:ring-teal/50 outline-none transition-all placeholder:text-white/20"
                 />
              </div>

              <div className="flex flex-wrap gap-3">
                 <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-bold uppercase tracking-widest transition-all">
                    <Filter className="h-3 w-3" /> Filters
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-teal/20 transition-all hover:translate-y-[-1px]">
                    Analyze All Current Signals
                 </button>
              </div>
           </section>

           {/* Section 2: Rule History */}
           <section className="space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Newspaper className="h-4 w-4 text-slate-400" />
                    <h3 className="text-sm font-bold text-ink uppercase tracking-widest">Master Rulebook Audit</h3>
                 </div>
                 <button className="text-[10px] font-bold text-teal hover:underline tracking-widest uppercase">View Full History</button>
              </div>

              <div className="grid gap-4">
                 {Object.entries(overview.regulations.rulebook).map(([key, rule]) => (
                    <article key={key} className="surface-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-teal/20 transition-hover">
                       <div className="space-y-1">
                          <div className="flex items-center gap-3">
                             <h4 className="text-sm font-bold text-ink italic leading-none">{key.replaceAll("_", " ")}</h4>
                             <span className="px-2 py-0.5 rounded bg-emerald-50 text-[9px] font-bold text-emerald-600 uppercase">ACTIVE</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{rule.theme}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-black text-ink">{rule.value}</p>
                          <div className="flex items-center justify-end gap-1.5 mt-1">
                             <Calendar className="h-3 w-3 text-slate-300" />
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Staged: 2024-02-14</p>
                          </div>
                       </div>
                    </article>
                 ))}
              </div>
           </section>
        </div>

        <div>
           <RegulatoryTimeline 
              updates={overview.regulations.updates} 
              rulebook={overview.regulations.rulebook} 
           />
        </div>
      </div>
    </div>
  );
}

