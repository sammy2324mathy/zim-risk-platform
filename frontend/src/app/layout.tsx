import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/styles/globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Zim Risk OS - Enterprise Risk Platform",
  description: "AI-powered regulatory compliance and risk management platform for Zimbabwean financial institutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white min-h-screen text-slate-900 selection:bg-blue-600/10 flex flex-row overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto scroll-smooth bg-slate-50/30">
            <div className="max-w-[1600px] mx-auto p-10 min-h-full flex flex-col">
              {children}
            </div>
          </div>
          <footer className="h-14 border-t border-slate-100 bg-white flex items-center justify-between px-10 text-[9px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
             <div className="flex items-center gap-6">
                <span>Infrastructure: HARA-SECURE-NODE-01</span>
                <span>Latency: 12ms</span>
                <span>Audit Sync: P50_VAL_OK</span>
             </div>
             <p>© 2026 ZIM PORTFOLIO OS • STATUTORY RISK SYSTEMS</p>
          </footer>
        </main>
      </body>
    </html>
  );
}

