"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Wallet, 
  BarChart3, 
  ShieldCheck, 
  BrainCircuit, 
  Settings, 
  ChevronRight,
  LogOut,
  Landmark
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Executive Suite", icon: LayoutDashboard, path: "/dashboard" },
  { id: "ecl", label: "IFRS 9 / ECL", icon: Wallet, path: "/ecl" },
  { id: "stress", label: "Stress Testing Lab", icon: BarChart3, path: "/stress" },
  { id: "compliance", label: "Compliance Radar", icon: ShieldCheck, path: "/compliance" },
  { id: "ml", label: "Intelligence Hub", icon: BrainCircuit, path: "/ml" },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <aside className="h-screen w-72 flex flex-col bg-[#0f172a] text-slate-400 z-50 shrink-0 select-none border-r border-white/5">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-blue-600 rounded flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
             <Landmark className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white tracking-wider uppercase leading-none">ZIM PORTFOLIO OS</h1>
            <span className="text-[9px] font-bold text-slate-500 mt-1 tracking-widest uppercase">Statutory Infrastructure v1.2</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4 block">Terminal Access</label>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded text-[11px] font-bold uppercase tracking-widest transition-all ${
                  active 
                    ? "bg-white/5 text-white border-l-2 border-blue-500 pl-[14px]" 
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                 <Icon className={`h-4 w-4 ${active ? "text-blue-500" : "text-slate-500"}`} />
                 <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-6">
        <div className="bg-white/5 rounded p-4 border border-white/5">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Service Status</span>
              <div className="flex items-center gap-2">
                 <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                 <span className="text-[9px] font-black text-white uppercase tracking-tighter">ONLINE</span>
              </div>
           </div>
           <p className="text-[9px] font-mono text-slate-500 leading-relaxed">
              NODE_ID: HARA-001 (ENCRYPTED_AUTH)
           </p>
        </div>

        <button className="flex w-full items-center gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-rose-500 transition-colors group">
          <LogOut className="h-3 w-3" />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}

