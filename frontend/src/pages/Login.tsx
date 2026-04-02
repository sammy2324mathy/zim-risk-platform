"use client";

import { useState } from "react";
import { ShieldCheck, Mail, Lock, Landmark, Zap, ShieldAlert } from "lucide-react";
import Link from "next/link";

export function LoginPage() {
  const [role, setRole] = useState<'officer' | 'manager' | 'regulator'>('manager');

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Visual Brand Panel */}
        <div className="bg-ink p-12 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">
           <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
              <ShieldCheck className="size-64" />
           </div>
           <div className="relative space-y-8">
              <div className="flex items-center gap-3">
                 <div className="size-10 bg-teal rounded-xl flex items-center justify-center text-ink">
                    <ShieldCheck className="h-6 w-6" />
                 </div>
                 <h1 className="text-2xl font-black uppercase tracking-widest italic">ZimRisk OS.</h1>
              </div>
              <div className="space-y-4 max-w-sm">
                 <h2 className="text-5xl font-bold leading-tight">Secure Financial Intelligence.</h2>
                 <p className="text-white/50 text-sm font-medium leading-relaxed">
                    Industry-grade regulatory oversight, machine-learned risk engines, and real-time capital adequacy monitoring for Zimbabwean banks.
                 </p>
              </div>
           </div>
           <div className="relative pt-12 border-t border-white/5 flex items-center gap-6">
              <Zap className="h-5 w-5 text-teal" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                 Vectorized Vault System V1.2.0 • SHA-512 Encrypted
              </p>
           </div>
        </div>

        {/* Login Form Panel */}
        <div className="p-10 lg:p-20 space-y-12">
           <div className="space-y-2">
              <h3 className="text-3xl font-extrabold text-ink tracking-tight">System Authentication</h3>
              <p className="text-slate-500 font-medium text-sm">Enter your credentials to access the risk infrastructure.</p>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Email</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-teal transition-colors" />
                    <input 
                      type="email" 
                      placeholder="e.g. j.doe@zimrisk.co.zw" 
                      className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-teal/20 focus:bg-white transition-all"
                    />
                 </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Encrypted Password</label>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-teal transition-colors" />
                    <input 
                      type="password" 
                      placeholder="••••••••••••" 
                      className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-teal/20 focus:bg-white transition-all"
                    />
                 </div>
              </div>

              <Link 
                href="/"
                className="w-full h-16 rounded-[40px] bg-ink hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center shadow-xl shadow-ink/20 transition-all hover:translate-y-[-2px] active:scale-[0.98]"
              >
                Sign In to Vault
              </Link>

              <button className="w-full h-16 rounded-[40px] border border-slate-200 bg-white hover:bg-slate-50 text-ink font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 transition-all relative">
                 <Landmark className="h-4 w-4 text-indigo-500" />
                 Secure Login with RBZ SSO
                 <span className="absolute -top-2 right-6 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded uppercase">External</span>
              </button>
           </div>

           <div className="pt-10 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Select Access Perspective</p>
              <div className="grid grid-cols-3 gap-3">
                 <button 
                   onClick={() => setRole('officer')}
                   className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                     role === 'officer' ? 'bg-mist border-teal text-ink ring-4 ring-teal/5' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                   }`}
                 >
                    <div className={role === 'officer' ? 'text-teal' : ''}><ShieldAlert className="h-4 w-4" /></div>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Officer</span>
                 </button>
                 <button 
                    onClick={() => setRole('manager')}
                    className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                     role === 'manager' ? 'bg-mist border-teal text-ink ring-4 ring-teal/5' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                   }`}
                 >
                    <div className={role === 'manager' ? 'text-teal' : ''}><ShieldCheck className="h-4 w-4" /></div>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Manager</span>
                 </button>
                 <button 
                    onClick={() => setRole('regulator')}
                    className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                     role === 'regulator' ? 'bg-mist border-teal text-ink ring-4 ring-teal/5' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                   }`}
                 >
                    <div className={role === 'regulator' ? 'text-teal' : ''}><Landmark className="h-4 w-4" /></div>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Regulator</span>
                 </button>
              </div>
           </div>

           <div className="flex items-center gap-3 bg-ember/5 border border-ember/10 p-4 rounded-2xl text-ember shadow-inner">
              <ShieldAlert className="h-4 w-4 flex-shrink-0" />
              <p className="text-[10px] font-bold leading-relaxed uppercase tracking-wider">
                 Your data is end-to-end encrypted. Audited session logging is active.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

