"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Database, 
  BarChart3, 
  BrainCircuit, 
  ChevronRight, 
  Activity,
  Zap,
  Lock,
  Globe,
  Terminal,
  Landmark
} from "lucide-react";

export default function LandingView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 pb-40">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
           <div className="size-16 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/20">
              <Landmark className="h-8 w-8" />
           </div>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase">Zim Portfolio OS.</h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] italic">Statutory Infrastructure V1.2 • RBZ_SYNC_ACTIVE</p>
      </div>

      <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3 max-w-6xl w-full px-6">
        {/* Module 1: Dashboard */}
        <Link href="/" className="group surface-card p-10 hover:border-blue-600 transition-all hover:translate-y-[-4px] bg-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
              <BarChart3 className="size-24" />
           </div>
           <div className="relative space-y-6">
              <div className="size-10 rounded bg-slate-900 text-white flex items-center justify-center">
                 <Globe className="h-5 w-5" />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Executive Portfolio Desk</h2>
                 <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
                    High-level insights, statutory reporting, and IFRS 9 staging analytics for the consolidated loan book.
                 </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest pt-4">
                 Launch Desk <ChevronRight className="h-3 w-3" />
              </div>
           </div>
        </Link>

        {/* Module 2: Stress Lab */}
        <Link href="/stress" className="group surface-card p-10 hover:border-blue-600 transition-all hover:translate-y-[-4px] bg-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
              <Activity className="size-24" />
           </div>
           <div className="relative space-y-6">
              <div className="size-10 rounded bg-blue-600 text-white flex items-center justify-center">
                 <Zap className="h-5 w-5" />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Risk Simulation Lab</h2>
                 <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
                    Probabilistic stress testing, automated scenario design, and capital adequacy validation workspace.
                 </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest pt-4">
                 Open Lab <ChevronRight className="h-3 w-3" />
              </div>
           </div>
        </Link>

        {/* Module 3: DS Lab */}
        <Link href="/ml" className="group surface-card p-10 hover:border-blue-600 transition-all hover:translate-y-[-4px] bg-slate-900 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
              <Terminal className="size-24" />
           </div>
           <div className="relative space-y-6">
              <div className="size-10 rounded bg-white text-slate-900 flex items-center justify-center">
                 <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white uppercase tracking-tight">Modeling Workbench [DS]</h2>
                 <p className="mt-2 text-xs text-slate-400 leading-relaxed font-medium">
                    Solve actuarial problems, train PD/LGD models, and manage statutory inference artifacts in a kernel-based environment.
                 </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest pt-4">
                 Access Workbench <ChevronRight className="h-3 w-3" />
              </div>
           </div>
        </Link>
      </div>

      <div className="flex items-center gap-12 pt-10">
         <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TLS_ENCRYPTED_SESSION</span>
         </div>
         <div className="flex items-center gap-3">
            <Database className="h-4 w-4 text-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HARA_DW_CONNECTED</span>
         </div>
         <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SYSTEM_INTEGRITY_OK</span>
         </div>
      </div>
    </div>
  );
}
