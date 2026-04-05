"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, FileText, Download, Landmark, Scale, AlertCircle, History, Share2, ClipboardList } from "lucide-react";
import { getRegulatoryUpdates, getReportUrl } from "@/api";
import type { RegulatoryUpdate } from "@/types";

export function ComplianceCenter() {
   const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     getRegulatoryUpdates().then(data => {
       setUpdates(data);
       setLoading(false);
     });
   }, []);

   const handleDownload = (type: 'rbz_xml' | 'compliance') => {
     window.open(getReportUrl(type), '_blank');
   };

   return (
      <div className="space-y-12 pb-20 font-sans italic">
         <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="size-10 bg-emerald-600 rounded-sm flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                     <ShieldCheck className="h-6 w-6" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Statutory_Reporting_Node</p>
               </div>
               <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic underline decoration-emerald-600/20">Compliance_Center.</h1>
               <p className="text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
                  Regional node for statutory IFRS 9 XML ingestion, RBZ circular auditing, and automated compliance BRIEF generation.
               </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Security Posture</p>
                  <p className="text-xl font-black text-emerald-600 font-mono leading-none flex items-center gap-2">
                     <Landmark className="h-4 w-4" />
                     REGULARIZED
                  </p>
               </div>
               <div className="h-10 w-px bg-slate-200 mx-2" />
               <button 
                 onClick={() => handleDownload('rbz_xml')}
                 className="h-12 px-6 rounded-sm bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98]"
               >
                  <Download className="h-4 w-4 text-emerald-500" />
                  Generate RBZ_XML
               </button>
            </div>
         </header>

         <div className="grid gap-12 lg:grid-cols-[1.5fr,1fr]">
            <section className="space-y-12">
               <div className="surface-card p-12 bg-white border-2 border-slate-100 italic space-y-8 shadow-xl shadow-slate-900/5">
                  <div className="flex items-center justify-between underline decoration-emerald-500/20">
                     <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Active Circular Stream: 2026_Q2</h3>
                     </div>
                     <span className="text-[9px] font-mono text-slate-400 uppercase">SID: REG_HARA_094</span>
                  </div>
                  <div className="space-y-4">
                     {loading ? (
                        <p className="text-[10px] font-black text-slate-400 uppercase animate-pulse">Retrieving Regulatory Artifacts...</p>
                     ) : updates.map((c) => (
                        <div key={c.update_id} className="p-6 rounded-sm border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition-all cursor-pointer group">
                           <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{c.title}</p>
                              <span className={`text-[9px] font-mono font-bold ${c.severity === 'Critical' ? 'text-rose-600' : 'text-emerald-600'}`}>{c.theme}</span>
                           </div>
                           <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{c.summary}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
            <aside className="space-y-10">
               <div className="surface-card p-10 bg-slate-900 text-white rounded-2xl border-white/5 space-y-10 shadow-2xl relative">
                  <div className="absolute top-4 right-4">
                     <Scale className="h-6 w-6 text-emerald-500/50" />
                  </div>
                  <div className="flex items-center gap-3">
                     <ClipboardList className="h-4 w-4 text-emerald-500" />
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Audit Integrity Metrics</h4>
                  </div>
                  <div className="space-y-6">
                     {[
                        { label: "Data Quality Score", val: "99.8%", color: "text-emerald-500" },
                        { label: "Reconciliation Drift", val: "0.02%", color: "text-blue-400" },
                        { label: "Breach Incident Rate", val: "Lo-Risk", color: "text-emerald-500" },
                     ].map((m) => (
                        <div key={m.label} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 italic">
                           <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{m.label}</span>
                           <span className={`text-[11px] font-black ${m.color} uppercase tracking-widest`}>{m.val}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </aside>
         </div>
      </div>
   );
}
