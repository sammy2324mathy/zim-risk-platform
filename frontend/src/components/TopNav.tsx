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
  Bell,
  Search,
  User,
  Landmark
} from "lucide-react";

const navigation = [
  { name: "Executive Suite", href: "/dashboard", icon: LayoutDashboard },
  { name: "IFRS 9 / ECL", href: "/ecl", icon: Wallet },
  { name: "Stress Testing Lab", href: "/stress", icon: BarChart3 },
  { name: "Compliance Radar", href: "/compliance", icon: ShieldCheck },
  { name: "Intelligence Hub", href: "/ml", icon: BrainCircuit },
];

export function TopNav() {
  const pathname = usePathname();

  // Do not show TopNav on Login page
  if (pathname === "/login") return null;

  return (
    <nav className="h-16 border-b border-slate-200 bg-[#0f172a] text-white flex items-center px-10 sticky top-0 z-50 shadow-lg select-none">
      <div className="flex items-center gap-8 flex-1">
        <Link href="/" className="flex items-center gap-3 pr-8 border-r border-white/10 group cursor-pointer">
          <div className="size-8 bg-blue-600 rounded flex items-center justify-center text-white shadow-xl shadow-blue-600/20 group-hover:scale-105 transition-all">
             <Landmark className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-black tracking-[0.2em] uppercase leading-none text-white">ZIM PORTFOLIO OS</h1>
            <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-widest leading-none">Statutory Infrastructure v1.2</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center gap-3 ${
                  active 
                    ? "text-blue-400" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <item.icon className={`h-3 w-3 ${active ? "text-blue-400" : "text-slate-500"}`} />
                <span>{item.name}</span>
                {active && (
                   <div className="absolute bottom-[-16px] left-0 w-full h-[3px] bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden xl:flex flex-col text-right">
           <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Infrastructure Status</span>
           <div className="flex items-center gap-2 justify-end">
              <span className="size-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-white">NODAL_SYNC_OK</span>
           </div>
        </div>
        
        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
           <div className="size-8 rounded border border-white/5 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors relative">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-1.5 right-1.5 size-1.5 bg-rose-500 rounded-full border border-[#0f172a]" />
           </div>
           <div className="h-8 flex items-center gap-3 pl-2 cursor-pointer group">
              <div className="h-8 w-8 rounded bg-white/10 text-white flex items-center justify-center text-[10px] font-black tracking-tighter shadow-sm group-hover:bg-blue-600 transition-colors">
                MJ
              </div>
           </div>
        </div>
      </div>
    </nav>
  );
}
