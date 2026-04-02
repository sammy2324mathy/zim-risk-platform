"use client";

import { 
  Zap, 
  Activity, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Search, 
  Filter, 
  ArrowRightCircle, 
  AlertTriangle,
  Scale,
  BrainCircuit,
  Maximize2
} from "lucide-react";

import { ConnectedPartyGraph } from "@/components/ConnectedPartyGraph";

export function FraudGraphPage() {
  return (
    <div className="space-y-10 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-indigo-500">
          <BrainCircuit className="h-4 w-4" />
          <p className="eyebrow text-indigo-500 font-bold tracking-[0.2em]">NEURAL_FRAUD_LATTICE_V2</p>
        </div>
        <h1 className="text-4xl font-extrabold text-ink tracking-tight italic uppercase">Fraud Resonance Lab.</h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed italic">
           Mapping graph-based contagion across director ownership chains, circular loan recycling, and connected-party exposure breaches.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.5fr,0.9fr]">
         <div className="space-y-8">
            <section className="surface-card p-1 overflow-hidden group bg-[#0a0f1c] shadow-2xl shadow-indigo-600/10">
               <div className="p-8 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                     <div className="size-2 rounded-full bg-indigo-500 animate-pulse" />
                     <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Real-time Relationship Lattice</h3>
                  </div>
                  <div className="flex items-center gap-4">
                     <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 transition-all"><Search className="h-4 w-4" /></button>
                     <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 transition-all"><Maximize2 className="h-4 w-4" /></button>
                  </div>
               </div>
               <ConnectedPartyGraph />
            </section>

            <section className="grid gap-6 md:grid-cols-2">
               <div className="surface-card p-10 bg-rose-600 text-white shadow-xl shadow-rose-600/10">
                  <div className="flex items-center gap-3 mb-6">
                     <AlertTriangle className="h-5 w-5" />
                     <h3 className="text-xl font-bold italic leading-none">High Exposure Cluster</h3>
                  </div>
                  <div className="space-y-6">
                     <div className="p-6 rounded-[32px] bg-white/10 border border-white/10">
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Entity Group ID</p>
                        <h4 className="text-xl font-black italic">CON-ZIM-042</h4>
                        <p className="text-xs font-medium text-white/70 leading-relaxed mt-4 italic">
                           Circular loan pattern detected across 4 director-held shell entities. 
                        </p>
                     </div>
                     <button className="w-full h-14 rounded-full bg-white text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] hover:translate-y-[-2px] transition-all">
                        Execute Freeze Action
                     </button>
                  </div>
               </div>
               
               <div className="surface-card p-10 bg-slate-900 border border-white/5 text-white flex flex-col justify-between">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-teal">
                        <ShieldCheck className="h-5 w-5" />
                        <h3 className="text-xl font-bold italic leading-none">Auditable Trail</h3>
                     </div>
                     <p className="text-xs text-white/40 leading-relaxed font-medium">
                        Automated KYC-AML scoring with recursive ownership unwinding up to the Ultimate Beneficial Owner (UBO).
                     </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-8">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-teal">Verified against FIU-ZIM 2024</span>
                     <ArrowRightCircle className="h-4 w-4 text-teal" />
                  </div>
               </div>
            </section>
         </div>

         <aside className="space-y-8">
            <div className="surface-card p-10 space-y-10">
               <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-indigo-400" />
                  <p className="data-label text-ink italic leading-none">Director Intelligence</p>
               </div>
               
               <div className="space-y-8">
                  <div className="flex items-center gap-6">
                     <div className="size-20 rounded-full bg-mist border border-slate-200 flex items-center justify-center font-black text-2xl text-slate-400">AM</div>
                     <div className="space-y-1">
                        <h4 className="text-xl font-black text-ink leading-tight">Adam Mandaza</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Board Member | Tier 1 Risk</p>
                     </div>
                  </div>
                  
                  <div className="grid gap-3">
                     <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 italic">Interests</span>
                        <span className="text-sm font-black text-ink">4 Entities</span>
                     </div>
                     <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 italic">Contagion Prob.</span>
                        <span className="text-sm font-black text-rose-500">High (0.84)</span>
                     </div>
                  </div>
                  
                  <div className="p-6 rounded-[32px] bg-indigo-50 border border-indigo-100 italic font-bold text-[10px] text-indigo-600 leading-relaxed">
                     Connected Party Exposure: $14.2M (Exceeds Single Name Limit: 15%)
                  </div>
               </div>

               <button className="w-full h-14 rounded-2xl bg-ink text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-ink/10 transition-all hover:bg-slate-800">
                  Open Relationship Matrix
               </button>
            </div>

            <section className="surface-card p-10 space-y-8">
               <div className="flex items-center gap-3">
                  <Scale className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-ink leading-none">Regulatory Overlays</h3>
               </div>
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-xs font-bold text-ink">
                     <span>SI 142/2019 Thresholds</span>
                     <span className="text-teal">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-xs font-bold text-ink">
                     <span>Sanction List Sync</span>
                     <span className="text-slate-400">SYNCING_P5</span>
                  </div>
               </div>
            </section>
         </aside>
      </div>
    </div>
  );
}
