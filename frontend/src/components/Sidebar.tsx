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
  LogOut
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { id: "ecl", label: "IFRS 9 / ECL", icon: Wallet, path: "/ecl" },
  { id: "stress", label: "Stress Lab", icon: BarChart3, path: "/stress" },
  { id: "compliance", label: "Compliance", icon: ShieldCheck, path: "/compliance" },
  { id: "ml", label: "ML Development", icon: BrainCircuit, path: "/ml" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-slate-200 bg-white shadow-sm z-50">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-ink rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-xs uppercase tracking-tighter">ZR</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-ink leading-tight uppercase tracking-widest">ZIM RISK</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase font-mono tracking-wider italic">Infrastructure V1.2</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center justify-between group gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                active 
                  ? "bg-slate-100 text-ink shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-ink"
              }`}
            >
              <div className="flex items-center gap-3">
                 <item.icon className={`h-4 w-4 ${active ? "text-teal" : "text-slate-400 group-hover:text-ink"}`} />
                 <span className={active ? "font-bold" : ""}>{item.label}</span>
              </div>
              {active && <div className="size-1 rounded-full bg-teal animate-pulse" />}
              {!active && <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-slate-300" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-4">
        <div className="rounded-2xl bg-mist p-4">
           <div className="flex items-center gap-3 mb-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold text-ink uppercase tracking-wider">Engine: NORMAL</p>
           </div>
           <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
              Vector paths synchronized over Node-Alpha.
           </p>
        </div>

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all group">
          <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Audit Log Off</span>
        </button>
      </div>
    </aside>
  );
}

