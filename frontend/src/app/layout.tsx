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
      <body className="antialiased bg-slate-50 min-h-screen text-slate-800 selection:bg-teal/30">
        <Sidebar />
        <main className="pl-64 min-h-screen">
          <div className="max-w-[1600px] mx-auto p-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

