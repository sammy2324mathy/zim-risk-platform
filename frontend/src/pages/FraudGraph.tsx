"use client";

import { 
  Network, 
  Search, 
  Filter, 
  ShieldAlert, 
  AlertCircle, 
  History, 
  ArrowUpRight 
} from "lucide-react";

import { ConnectedPartyGraph } from "@/components/ConnectedPartyGraph";

const cases = [
  { id: "CAS-2024-001", entity: "Company X", type: "Circular Loan", risk: "Critical", status: "Staged" },
  { id: "CAS-2024-002", entity: "Director B", type: "Exposure Violation", risk: "High", status: "Review" },
  { id: "CAS-2024-003", entity: "Agri-Holdings", type: "Related Party", risk: "Medium", status: "Open" },
];

export function FraudGraphPage() {
  return (
    <div className="space-y-10 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-rose-500">
          <Network className="h-4 w-4" />
          <p className="eyebrow text-rose-500 font-bold tracking-[0.2em]">CONNECTED PARTY DETECTOR</p>
        </div>
        <h1 className="text-4xl font-extrabold text-ink tracking-tight">Fraud Resonance Lab.</h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed">
          Integrated graph analysis for detecting circular loan recycling, beneficial ownership transparency, and regulatory exposure breaches (>15% cap).
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr, 380px]">
        <div className="space-y-8">
           <ConnectedPartyGraph />
           
           <section className="surface-card p-10 space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <History className="h-4 w-4 text-slate-400" />
                    <h3 className="text-sm font-bold text-ink uppercase tracking-widest">Active Investigation Cases</h3>
                 </div>
                 <button className="text-[10px] font-bold text-teal tracking-widest uppercase hover:underline">Full Case History</button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                 {cases.map((c) => (
                    <article key={c.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-6 space-y-4 transition-all hover:-translate-y-1 hover:border-rose-500/30">
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-bold text-slate-400">{c.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                             c.risk === 'Critical' ? 'bg-rose-100 text-rose-600' : 
                             c.risk === 'High' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                          }`}>{c.risk}</span>
                       </div>
                       <h4 className="font-bold text-ink text-lg italic leading-none">{c.entity}</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{c.type}</p>
                       <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal mt-4 group">
                          View Artifacts <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                       </button>
                    </article>
                 ))}
              </div>
           </section>
        </div>

        <aside className="space-y-6">
           <div className="surface-card p-8 bg-ink text-white space-y-8">
              <div className="flex items-center gap-3">
                 <Filter className="h-5 w-5 text-teal" />
                 <p className="eyebrow text-white text-[10px] uppercase font-bold tracking-[0.2em]">Graph Logic Filters</p>
              </div>
              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Degree of Separation</label>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-2/3 bg-teal" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-white/40">
                       <span>1st</span>
                       <span className="text-white">3rd</span>
                       <span>6th</span>
                    </div>
                 </div>
                 
                 <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold italic">Show Ownership</span>
                       <div className="size-5 rounded-md bg-teal border border-teal flex items-center justify-center">
                          <CheckIcon />
                       </div>
                    </div>
                    <div className="flex items-center justify-between opacity-50">
                       <span className="text-xs font-bold italic">Show Beneficial</span>
                       <div className="size-5 rounded-md border border-white/20" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold italic">Show Circular</span>
                       <div className="size-5 rounded-md bg-rose-500 border border-rose-500 flex items-center justify-center">
                          <CheckIcon />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="rounded-[40px] border border-slate-200 p-10 space-y-8">
              <div className="flex items-center gap-3">
                 <ShieldAlert className="h-5 w-5 text-ember" />
                 <h3 className="text-2xl font-bold italic leading-none">Exposure Alerting.</h3>
              </div>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                 Entity grouping for **Company X** breaches the 15% Tier 1 Capital adequacy threshold as of Q2 close.
              </p>
              <div className="p-4 rounded-2xl bg-mist border border-slate-100 flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase tracking-widest text-ink">GROUP EXPOSURE %</span>
                 <span className="text-xl font-black text-rose-500">18.2%</span>
              </div>
              <button className="w-full rounded-[40px] bg-ember py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-ember/20 hover:scale-[1.02] transition-all">
                 Finalize Regulatory Flag
              </button>
           </div>

           <div className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 flex items-center gap-6">
              <div className="size-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                 <AlertCircle className="h-5 w-5 text-indigo-500" />
              </div>
              <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
                 Audit trail verified against RBZ connected-party rule 05-02B.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

