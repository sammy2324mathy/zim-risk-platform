"use client";

import { useEffect, useState, startTransition } from "react";
import { 
  Users, 
  Search, 
  ShieldAlert, 
  Network, 
  Map as MapIcon, 
  AlertCircle, 
  Filter, 
  Eye, 
  Share2,
  Lock,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Layout
} from "lucide-react";

import { getDashboardOverview, getFraudGraph } from "@/api";
import type { DashboardOverview } from "@/types";

export function FraudGraph() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    startTransition(() => {
      Promise.all([getDashboardOverview(), getFraudGraph()]).then(([ov, gr]) => {
        if (cancelled) return;
        setOverview(ov);
        setGraphData(gr);
        setLoading(false);
      });
    });
    return () => { cancelled = true; };
  }, []);

  const isRegulator = overview?.tenant_id === "RBZ";

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
       <div className="text-center space-y-4">
          <div className="size-12 bg-rose-50 border border-rose-100 rounded-lg mx-auto flex items-center justify-center animate-pulse">
             <Network className="h-6 w-6 text-rose-600" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Traversing Connection Vectors...</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="size-10 bg-rose-600 rounded-sm flex items-center justify-center text-white shadow-xl shadow-rose-600/20">
                  <Users className="h-6 w-6" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Connected Party Intelligence</p>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic underline decoration-rose-600/20">Fraud_Graph.</h1>
            <p className="text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
               {isRegulator 
                ? "National oversight for systemic circular lending and cross-institutional governance breaches. Traversing all compliant nodes."
                : "Internal portfolio mapping for connected-party concentration and director interest auditing."
               }
            </p>
         </div>
         <div className="flex items-center gap-4">
            {isRegulator && (
               <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-sm flex items-center gap-3">
                  <ShieldAlert className="h-4 w-4 text-rose-600" />
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-none">Global_Oversight_Active</span>
               </div>
            )}
            <button className="h-12 px-6 rounded-sm bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98]">
               <Share2 className="h-4 w-4 text-rose-500" />
               Entity Request
            </button>
         </div>
      </header>

      {/* Surface */}
      <div className="grid gap-12 xl:grid-cols-[2fr,1fr]">
         <div className="space-y-12">
            {/* Interactive Graph Display (Visualized with SVG/Design placeholders for High Fidelity) */}
            <section className="surface-card p-0 h-[600px] border-2 border-slate-100 bg-white shadow-2xl relative group overflow-hidden">
               <div className="absolute top-0 left-0 p-6 border-r border-b border-slate-100 bg-slate-50 z-10 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <div className="size-2 bg-rose-600 rounded-full animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">Active Map</span>
                  </div>
                  <div className="h-3 w-px bg-slate-200" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">3 Nodes Involved</span>
               </div>

               <div className="absolute top-0 right-0 p-6 z-10 flex gap-2">
                  <button className="p-2 bg-white border border-slate-200 rounded shadow-sm hover:border-rose-400 transition-all"><Filter className="h-4 w-4 text-slate-400" /></button>
                  <button className="p-2 bg-white border border-slate-200 rounded shadow-sm hover:border-rose-400 transition-all"><MapIcon className="h-4 w-4 text-slate-400" /></button>
               </div>

               {/* Design Overlay for Graph (Simplified interactive nodes) */}
               <div className="h-full relative italic">
                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                  
                  {/* Mock Force Directed Graph Visualization */}
                  <svg className="w-full h-full p-40">
                     <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                           <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                        </marker>
                     </defs>
                     {/* Links */}
                     <line x1="250" y1="50" x2="100" y2="180" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow)" className="opacity-20 hover:opacity-100 transition-opacity" />
                     <line x1="100" y1="180" x2="250" y2="350" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow)" className="opacity-20" />
                     <line x1="250" y1="350" x2="250" y2="50" stroke="#f43f5e" strokeWidth="3" markerEnd="url(#arrow)" className="opacity-40 animate-pulse" />
                     
                     {/* Nodes */}
                     <circle cx="250" cy="50" r="40" fill="#0f172a" />
                     <text x="250" y="55" fontSize="10" fill="white" textAnchor="middle" className="font-black uppercase tracking-widest italic">{isRegulator ? "NATIONAL_OS" : "BANK_ALPHA"}</text>
                     
                     <circle cx="100" cy="180" r="30" fill="white" stroke="#f43f5e" strokeWidth="2" />
                     <text x="100" y="235" fontSize="9" fill="#f43f5e" textAnchor="middle" className="font-black uppercase tracking-widest italic">Director_A</text>
                     
                     <rect x="200" y="330" width="100" height="40" fill="white" stroke="#0f172a" strokeWidth="1" />
                     <text x="250" y="355" fontSize="9" fill="#0f172a" textAnchor="middle" className="font-black uppercase tracking-widest italic leading-none">Industrial_Corp_X</text>
                  </svg>
                  
                  {/* Legend Overlay */}
                  <div className="absolute bottom-6 left-6 p-4 rounded-sm bg-slate-900 text-white font-mono text-[8px] font-black uppercase tracking-widest space-y-2 opacity-80 backdrop-blur-md">
                     <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-blue-600" /> Institution Node</div>
                     <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-rose-600" /> Director Interest</div>
                     <div className="flex items-center gap-2"><span className="size-2 border-2 border-rose-600 border-dashed" /> Circularity Breach</div>
                  </div>
               </div>
            </section>
         </div>

         <aside className="space-y-10">
            {/* Alert List */}
            <div className="surface-card p-10 space-y-10 bg-white border-2 border-slate-100 shadow-xl shadow-slate-900/5 h-full italic">
               <div className="space-y-4 border-b border-slate-100 pb-8">
                  <div className="flex items-center gap-3">
                     <AlertCircle className="h-5 w-5 text-rose-600" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 underline decoration-rose-600/30">Intelligence_Signals:</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed leading-none">High-confidence anomalies detected across the corridor.</p>
               </div>

               <div className="space-y-6">
                  {[
                     { label: "Circular_Vector [Breach]", status: "CRITICAL", theme: "rose", details: "Self-lending loop detected via Director A through Corp X." },
                     { label: "Concentration Breach", status: "WARNING", theme: "amber", details: "Industrial Corp Exposure exceeds 15% Tier-1 limit." },
                  ].map((a) => (
                    <div key={a.label} className={`p-6 rounded-sm border-l-4 ${a.theme === 'rose' ? 'bg-rose-50/50 border-rose-600' : 'bg-amber-50/50 border-amber-600'} space-y-3 shadow-lg shadow-black/5`}>
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{a.label}</p>
                          <span className={`text-[8px] font-black uppercase tracking-widest ${a.theme === 'rose' ? 'text-rose-600' : 'text-amber-600'}`}>{a.status}</span>
                       </div>
                       <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{a.details}</p>
                       <button className="text-[8px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1 hover:underline underline-offset-4">
                          Establish Investigation Desk <ChevronRight className="h-3 w-3" />
                       </button>
                    </div>
                  ))}
               </div>

               <div className="pt-8 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                     <span className="text-slate-400 italic">Identity_Match:</span>
                     <span className="text-slate-900 underline decoration-2 underline-offset-4 decoration-rose-600/20">97.8% Confidence</span>
                  </div>
                  <button className="w-full h-14 bg-slate-900 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                     <Lock className="h-4 w-4 text-rose-500" />
                     Authorized System Lock_
                  </button>
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
}
