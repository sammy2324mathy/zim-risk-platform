"use client";

import { useMemo } from "react";
import { 
  Users, 
  ChevronRight, 
  Search, 
  Maximize2, 
  AlertCircle, 
  ShieldAlert 
} from "lucide-react";

type Node = {
  id: string;
  label: string;
  type: 'bank' | 'director' | 'company';
  amount?: string;
  percentage?: string;
  x: number;
  y: number;
};

type Link = {
  source: string;
  target: string;
  label: string;
};

const nodes: Node[] = [
  { id: 'bank', label: 'ZimRisk Bank', type: 'bank', amount: '$50M', x: 250, y: 50 },
  { id: 'dirA', label: 'Director A', type: 'director', percentage: '45%', x: 100, y: 180 },
  { id: 'dirB', label: 'Director B', type: 'director', percentage: '40%', x: 250, y: 180 },
  { id: 'dirC', label: 'Director C', type: 'director', percentage: '15%', x: 400, y: 180 },
  { id: 'cox', label: 'Company X', type: 'company', amount: '$4.2M', x: 250, y: 350 },
];

const links: Link[] = [
  { source: 'bank', target: 'dirA', label: 'Ownership' },
  { source: 'bank', target: 'dirB', label: 'Ownership' },
  { source: 'bank', target: 'dirC', label: 'Ownership' },
  { source: 'dirA', target: 'cox', label: 'Interest' },
  { source: 'dirB', target: 'cox', label: 'Interest' },
  { source: 'cox', target: 'bank', label: 'Circular Loan' },
];

export function ConnectedPartyGraph() {
  return (
    <div className="surface-card flex flex-col h-full overflow-hidden bg-[#0a0f1c] text-white">
      <div className="border-b border-white/5 p-8 flex items-center justify-between">
        <div className="space-y-1">
           <div className="flex items-center gap-2 text-teal">
              <Users className="h-4 w-4" />
              <p className="eyebrow text-teal font-black tracking-[0.2em]">GRAPH PERSISTENCE ENGINE</p>
           </div>
           <h2 className="text-2xl font-bold italic">Entity Relationship Mapping.</h2>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input 
                placeholder="Search entities..." 
                className="h-12 w-64 rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-teal/30 transition-all"
              />
           </div>
           <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-all">
              <Maximize2 className="h-4 w-4" />
           </button>
        </div>
      </div>

      <div className="flex-1 relative min-h-[500px] overflow-hidden">
        {/* SVG Graph Layer */}
        <svg viewBox="0 0 500 450" className="w-full h-full p-10">
          {/* Grid Background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Lines (Edges) */}
          {links.map((link, i) => {
            const start = nodes.find(n => n.id === link.source)!;
            const end = nodes.find(n => n.id === link.target)!;
            const isCircular = link.label === 'Circular Loan';
            
            return (
              <g key={i}>
                <line 
                  x1={start.x} y1={start.y} 
                  x2={end.x} y2={end.y} 
                  stroke={isCircular ? "rgba(244,63,94,0.4)" : "rgba(20,184,166,0.2)"} 
                  strokeWidth="2" 
                  strokeDasharray={isCircular ? "5,5" : "0"} 
                />
                {isCircular && (
                  <circle r="4" fill="#f43f5e">
                    <animateMotion 
                      dur="3s" 
                      repeatCount="indefinite" 
                      path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} 
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Entities (Nodes) */}
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer group">
              <circle 
                r={node.type === 'bank' ? 40 : 30} 
                className={`fill-[#0f172a] stroke-2 group-hover:stroke-[6px] transition-all ${
                  node.type === 'bank' ? 'stroke-teal shadow-xl shadow-teal/20' : 
                  node.id === 'cox' ? 'stroke-rose-500 shadow-xl shadow-rose-500/20' : 
                  'stroke-slate-700'
                }`}
              />
              <text 
                y="5" 
                textAnchor="middle" 
                className="text-[8px] font-bold fill-white uppercase tracking-tighter"
              >
                 {node.label}
              </text>
              {node.amount && (
                <text 
                  y="18" 
                  textAnchor="middle" 
                  className="text-[10px] font-mono font-bold fill-teal"
                >
                  {node.amount}
                </text>
              )}
              {node.percentage && (
                <text 
                  y="18" 
                  textAnchor="middle" 
                  className="text-[10px] font-mono font-bold fill-slate-400"
                >
                  {node.percentage}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Floating Intelligence Cards */}
        <div className="absolute bottom-8 left-8 right-8 flex gap-4">
           <div className="flex-1 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                 <ShieldAlert className="h-5 w-5 text-rose-500 animate-pulse" />
                 <div>
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none mb-1">Circular Flow Detected</p>
                    <p className="text-sm font-medium text-white/70">
                       Bank A → Co. X → Dir A → Bank A (Capital Recycling Pattern identified).
                    </p>
                 </div>
              </div>
           </div>
           <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm flex items-center gap-6 px-10">
              <div className="text-center">
                 <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Avg Path</p>
                 <p className="text-xl font-bold">2.4</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Exposure%</p>
                 <p className="text-xl font-bold text-rose-500">18.2</p>
              </div>
           </div>
        </div>
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between text-white/30 text-[9px] font-bold uppercase tracking-widest">
         <span>Sync: PERSISTENT_PERSISTENCE_V4</span>
         <div className="flex items-center gap-6">
            <span className="text-teal">8 Nodes Audited</span>
            <span className="text-rose-500">2 Breaches Staged</span>
         </div>
      </div>
    </div>
  );
}

