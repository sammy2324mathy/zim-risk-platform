"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ChevronRight, 
  Database, 
  Fingerprint,
  Landmark,
  AlertCircle,
  Building2,
  Scale,
  Briefcase,
  Smartphone,
  ShieldAlert,
  Users
} from "lucide-react";
import { login } from "@/api";

export function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState<string | null>(null);
  const [deskLoading, setDeskLoading] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const DESKS = [
    { 
      id: "CABS", 
      name: "Commercial Bank Desk", 
      sub: "CABS Portal (Retail & Mortgage)",
      admin: "admin_cabs",
      analyst: "admin_cabs",
      icon: Building2,
      color: "border-blue-500 hover:bg-blue-50/50"
    },
    { 
      id: "ECOCASH", 
      name: "FinTech & Payments Desk", 
      sub: "EcoCash Holdings Hub",
      admin: "admin_ecocash",
      analyst: "analyst_ecocash",
      icon: Smartphone,
      color: "border-emerald-500 hover:bg-emerald-50/50"
    },
    { 
      id: "RBZ", 
      name: "National Oversight Desk", 
      sub: "RBZ Supervisor (Global View)",
      admin: "supervisor_rbz",
      analyst: "supervisor_rbz",
      icon: Scale,
      color: "border-rose-500 hover:bg-rose-50/50"
    }
  ];

  const handleLogin = async (e?: React.FormEvent, deskUser?: string) => {
    if (e) e.preventDefault();
    
    if (deskUser) setDeskLoading(deskUser);
    else setLoading(true);
    
    setError(null);
    const loginUser = deskUser || username;
    const loginPass = deskUser ? "" : (password || "zimrisk123");

    try {
      await login(loginUser, loginPass);
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: any) {
      console.error("Establish session failure:", err);
      setError("SESSION ERROR: Identity artifact rejected by central vault.");
      setLoading(false);
      setDeskLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#061e40] flex items-center justify-center z-[100] overflow-hidden p-6 font-sans">
      {/* Background Decorative Prism */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
         <div className="absolute top-[-20%] right-[-10%] size-[1200px] rounded-full bg-blue-500/20 blur-[180px]" />
         <div className="absolute bottom-[-20%] left-[-10%] size-[1200px] rounded-full bg-rose-500/10 blur-[180px]" />
      </div>

      <div className="relative w-full max-w-7xl h-[850px] flex flex-col lg:flex-row surface-card overflow-hidden shadow-3xl bg-white rounded-2xl border border-white/5">
        
        {/* Branding Pane */}
        <div className="lg:w-[32%] bg-slate-950 border-r border-white/5 p-16 flex flex-col justify-between relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-24 transition-transform hover:scale-[1.02]">
                 <div className="size-16 bg-blue-600 rounded-sm flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck className="h-10 w-10" />
                 </div>
                 <div>
                    <h1 className="text-3xl font-black tracking-[0.25em] uppercase text-white leading-none">Zim Risk.</h1>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-2">Enterprise_OS v2.2</p>
                 </div>
              </div>

              <div className="space-y-10 group">
                 <h2 className="text-6xl font-black leading-[0.9] tracking-tighter text-white uppercase italic group-hover:text-blue-500 transition-colors">Risk<br/>Operating<br/>System.</h2>
                 <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-medium border-l-4 border-blue-600 pl-6 py-2">
                    Multi-tenant workspace for institutional IFRS 9 staging, Monte Carlo stress modeling, and national supervisory oversight.
                 </p>
              </div>
           </div>

           <div className="relative z-10 flex flex-col gap-8">
              <div className="flex items-center gap-3">
                 <span className="size-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                 <span className="text-[11px] font-black text-white uppercase tracking-[0.25em]">Central Vault: SYNCED</span>
              </div>
              <div className="p-4 rounded border border-white/10 bg-white/5 font-mono">
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 italic">Statutory Encryption Hash</p>
                 <p className="text-[11px] text-blue-400 font-bold truncate">0x7F_SYNC_HIERARCHY_ESTABLISHED</p>
              </div>
           </div>
        </div>

        {/* Access Dashboard */}
        <div className="flex-1 bg-white p-16 flex flex-col justify-center overflow-y-auto">
           <div className="max-w-4xl mx-auto w-full space-y-20">
              <div className="space-y-6">
                 <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none lowercase italic underline decoration-blue-600/30">Connect_To_Institutional_Desk.</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">One-Click Multi-Persona Access Protocol</p>
              </div>

              {error && (
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                   <AlertCircle className="h-5 w-5 text-rose-600" />
                   <span className="text-[11px] font-black uppercase tracking-widest text-rose-600 italic leading-none">{error}</span>
                </div>
              )}

              {/* Multi-Desk Selectors */}
              <div className="grid md:grid-cols-3 gap-8">
                 {DESKS.map((desk) => (
                    <div key={desk.id} className="relative group/card">
                       <button 
                        disabled={loading || !!deskLoading}
                        onClick={() => setSelectedDesk(selectedDesk === desk.id ? null : desk.id)}
                        className={`w-full flex flex-col items-start p-10 rounded-2xl border-2 ${desk.color} transition-all active:scale-[0.98] ${selectedDesk === desk.id ? 'bg-slate-50 shadow-inner ring-4 ring-slate-100' : 'bg-white shadow-xl shadow-slate-900/5'}`}
                       >
                          <div className="size-14 rounded-full mb-8 flex items-center justify-center bg-white border border-slate-100 shadow-sm group-hover/card:scale-110 transition-transform">
                             <desk.icon className={`h-6 w-6 ${selectedDesk === desk.id ? 'text-slate-900' : 'text-slate-400 group-hover/card:text-slate-900 transition-colors'}`} />
                          </div>
                          <h4 className="text-[12px] font-black uppercase tracking-[0.25em] text-slate-900 mb-2 leading-none">{desk.name}</h4>
                          <p className="text-[10px] text-slate-400 uppercase tracking-tight leading-tight font-bold">{desk.sub}</p>
                          
                          <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-opacity">
                             <span>Select Identity Artifact</span>
                             <ChevronRight className="h-4 w-4" />
                          </div>
                       </button>

                       {/* Identity Artifact Menu (Hierarchy Switcher) */}
                       {selectedDesk === desk.id && (
                         <div className="absolute left-0 right-0 mt-4 p-2 bg-slate-950 border border-white/10 rounded-xl shadow-2xl z-30 animate-in zoom-in-95 duration-200">
                           <button 
                            onClick={() => handleLogin(undefined, desk.admin)}
                            className="w-full p-4 rounded hover:bg-white/5 flex items-center justify-between text-left group/item"
                           >
                             <div className="flex items-center gap-4">
                               <ShieldAlert className="h-4 w-4 text-rose-500" />
                               <div>
                                 <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Institutional Admin</p>
                                 <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest leading-none">Governance & Oversight</p>
                               </div>
                             </div>
                             {deskLoading === desk.admin ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Fingerprint className="h-4 w-4 text-white/10 group-hover/item:text-white/40 transition-colors" />}
                           </button>
                           <button 
                            onClick={() => handleLogin(undefined, desk.analyst)}
                            className="w-full p-4 rounded hover:bg-white/5 flex items-center justify-between text-left group/item mt-1"
                           >
                             <div className="flex items-center gap-4">
                               <Users className="h-4 w-4 text-blue-400" />
                               <div>
                                 <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Risk Specialist</p>
                                 <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest leading-none">Operational Modeling</p>
                               </div>
                             </div>
                             {deskLoading === desk.analyst ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Fingerprint className="h-4 w-4 text-white/10 group-hover/item:text-white/40 transition-colors" />}
                           </button>
                         </div>
                       )}
                    </div>
                 ))}
              </div>

              <div className="py-2 flex items-center gap-12">
                 <div className="h-px flex-1 bg-slate-100" />
                 <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Direct Cipher Entry Access Protocol</span>
                 <div className="h-px flex-1 bg-slate-100" />
              </div>

              <form onSubmit={(e) => handleLogin(e)} className="max-w-md mx-auto w-full space-y-8">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                       <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Master_ID"
                        className="w-full h-14 rounded border border-slate-200 bg-slate-50/50 pl-12 pr-4 text-xs font-black font-mono outline-none focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all italic"
                       />
                    </div>
                    <div className="relative group">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                       <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Cipher_Key"
                        className="w-full h-14 rounded border border-slate-200 bg-slate-50/50 pl-12 pr-4 text-xs font-black font-mono outline-none focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all italic"
                       />
                    </div>
                 </div>

                 <button 
                  type="submit"
                  disabled={loading || !!deskLoading}
                  className="w-full h-14 rounded bg-slate-900 text-white text-[12px] font-black uppercase tracking-[0.4em] shadow-3xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-4 active:scale-[0.99] disabled:opacity-50 italic"
                 >
                    {loading ? (
                       <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                       <>
                          <span>Establish Terminal Baseline</span>
                          <ChevronRight className="h-5 w-5" />
                       </>
                    )}
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
