"use client";

import { useEffect, useState, startTransition } from "react";
import { 
  ShieldCheck, 
  Activity, 
  LayoutDashboard, 
  Calculator, 
  Atom, 
  Zap, 
  Users, 
  BrainCircuit,
  LogOut,
  Bell,
  Search,
  Command,
  Settings,
  ShieldAlert,
  Archive,
  User
} from "lucide-react";

import { DashboardHub } from "@/views/Dashboard";
import { ECLCalculator } from "@/views/ECLCalculator";
import { StressTesting } from "@/views/StressTesting";
import { ComplianceCenter } from "@/views/ComplianceCenter";
import { FraudGraph } from "@/views/FraudGraph";
import { MLDevelopment } from "@/views/MLDevelopment";
import { getDashboardOverview, logout } from "@/api";
import type { DashboardOverview } from "@/types";

export function DashboardShell() {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    let cancelled = false;
    startTransition(() => {
      getDashboardOverview().then((data) => {
        if (cancelled) return;
        setOverview(data);
      }).catch((err) => {
        console.error("Auth session expired or invalid:", err);
      });
    });
    return () => { cancelled = true; };
  }, []);

  const isRegulator = overview?.tenant_id === "RBZ";

  const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard Hub", icon: LayoutDashboard, role: "any" },
    { id: "ecl", label: "ECL Workshop", icon: Calculator, role: "bank" },
    { id: "stress", label: "Stress Lab", icon: Atom, role: "any" },
    { id: "fraud", label: "Fraud Intelligence", icon: Users, role: "any" },
    { id: "compliance", label: "Compliance Center", icon: ShieldCheck, role: "any" },
    { id: "ml", label: "ML Workbench", icon: BrainCircuit, role: "admin" },
  ];

  // Filter based on rights
  const filteredNav = NAV_ITEMS.filter(item => {
    if (item.role === "bank" && isRegulator) return false;
    if (item.role === "admin" && !isRegulator) return false;
    return true;
  });

  const renderView = () => {
    switch (activeView) {
      case "dashboard": return <DashboardHub />;
      case "ecl": return <ECLCalculator />;
      case "stress": return <StressTesting />;
      case "compliance": return <ComplianceCenter />;
      case "fraud": return <FraudGraph />;
      case "ml": return <MLDevelopment />;
      default: return <DashboardHub />;
    }
  };

  if (!overview) return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 font-sans">
       <div className="text-center space-y-6">
          <div className="size-16 bg-blue-600 rounded-lg mx-auto flex items-center justify-center animate-pulse">
             <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
             <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Synching Institutional identity...</p>
             <h2 className="text-white text-sm font-bold opacity-30 italic">Statutory_Encryption_Handshake_Established</h2>
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fcfdfe] overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className={`bg-slate-950 text-white transition-all duration-300 flex flex-col relative ${sidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-4 mb-8">
           <div className={`size-10 rounded-sm flex items-center justify-center shadow-lg transition-colors ${isRegulator ? 'bg-rose-600 shadow-rose-600/20' : 'bg-blue-600 shadow-blue-600/20'}`}>
              {isRegulator ? <ShieldAlert className="h-6 w-6 text-white" /> : <Zap className="h-6 w-6 text-white" />}
           </div>
           {sidebarOpen && (
             <div className="animate-in fade-in duration-500">
                <h1 className="text-sm font-black tracking-[0.2em] uppercase leading-none">{overview.institution.split(' ')[0]} Risk.</h1>
                <p className={`text-[8px] font-bold tracking-[0.1em] mt-1 uppercase ${isRegulator ? 'text-rose-400' : 'text-blue-400'}`}>
                  {isRegulator ? 'Regulator_Control' : 'Bank_Operating_OS'}
                </p>
             </div>
           )}
        </div>

        <nav className="flex-1 px-4 space-y-4">
           {filteredNav.map((item) => (
             <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded transition-all group ${activeView === item.id ? 'bg-white/10 text-white shadow-inner' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
                <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${activeView === item.id ? (isRegulator ? 'text-rose-500' : 'text-blue-500') : ''}`} />
                {sidebarOpen && <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>}
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
           {isRegulator && sidebarOpen && (
             <div className="mb-4 p-4 rounded bg-rose-500/10 border border-rose-500/20">
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest leading-none mb-1">National Visibility: ACTIVE</p>
                <p className="text-[8px] text-rose-500/60 font-medium leading-relaxed italic">Synchronized stream across all commercial nodes.</p>
             </div>
           )}
           <button className="flex items-center gap-4 text-slate-600 hover:text-white transition-colors w-full px-2">
              <Archive className="h-4 w-4" />
              {sidebarOpen && <span className="text-[10px] font-bold uppercase tracking-widest">Master Audit_ Logs</span>}
           </button>
           <button 
            onClick={logout}
            className="flex items-center gap-4 text-rose-500 hover:text-rose-400 transition-colors w-full px-2 mt-4"
           >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && <span className="text-[10px] font-bold uppercase tracking-widest">Sever Session</span>}
           </button>
        </div>
      </aside>

      {/* Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Operational bar */}
        <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-8 relative z-20">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-sm border border-slate-100">
                 <Command className="h-3.5 w-3.5 text-slate-400" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active_Desk: </span>
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">{NAV_ITEMS.find(n => n.id === activeView)?.label || 'Hub'}</span>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="relative group hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                 <input 
                  placeholder={isRegulator ? "Search across National Corridors..." : "Sync portfolio artifact..."} 
                  className="h-9 w-64 rounded-sm border border-slate-100 bg-slate-50/50 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-slate-300 italic"
                 />
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors active:scale-110">
                 <Bell className="h-5 w-5" />
                 <span className="absolute top-1.5 right-1.5 size-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1">{overview.institution}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isRegulator ? 'Supervisor_Root' : 'Admin_Access'}</p>
                 </div>
                 <div className="size-10 rounded-full bg-slate-950 flex items-center justify-center border border-white/10 shadow-lg shadow-slate-900/10 group-hover:scale-105 transition-transform">
                    <User className="h-5 w-5 text-white" />
                 </div>
              </div>
           </div>
        </header>

        {/* View Surface */}
        <div className="flex-1 overflow-y-auto bg-[#fcfdfe] p-8 custom-scrollbar relative">
           <div className="max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-1000">
              {renderView()}
           </div>
        </div>
      </main>
    </div>
  );
}
