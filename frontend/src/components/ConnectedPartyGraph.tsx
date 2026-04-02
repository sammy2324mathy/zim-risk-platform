"use client";

import { useEffect, useState } from "react";
import { getFraudGraph } from "@/api";

interface Node {
  id: string;
  label: string;
  type: string;
  amount?: string;
  percentage?: string;
  x: number;
  y: number;
}

interface Link {
  source: string;
  target: string;
  label: string;
}

export function ConnectedPartyGraph() {
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] } | null>(null);

  useEffect(() => {
    getFraudGraph().then(setData);
  }, []);

  if (!data) return (
    <div className="h-[500px] flex items-center justify-center animate-pulse text-indigo-400">
      Initializing Fraud Lattice...
    </div>
  );

  return (
    <div className="relative w-full h-[500px] bg-[#0a0f1c] rounded-[40px] overflow-hidden border border-white/5 box-shadow-xl shadow-indigo-600/5">
      <svg className="w-full h-full" viewBox="0 0 500 500">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orientation="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
          </marker>
        </defs>

        {/* Links */}
        {data.links.map((link, i) => {
          const source = data.nodes.find(n => n.id === link.source);
          const target = data.nodes.find(n => n.id === link.target);
          if (!source || !target) return null;

          return (
            <g key={`link-${i}`}>
              <line
                x1={source.x} y1={source.y}
                x2={target.x} y2={target.y}
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="4 4"
                markerEnd="url(#arrowhead)"
                className="opacity-20 animate-pulse"
              />
              <text 
                x={(source.x + target.x) / 2} 
                y={(source.y + target.y) / 2 - 10} 
                className="text-[8px] font-black fill-slate-500 uppercase tracking-widest text-center"
              >
                {link.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {data.nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x},${node.y})`} className="cursor-pointer group">
            <circle 
              r="24" 
              className={`transition-all ${
                node.type === 'bank' ? 'fill-indigo-600' : 
                node.type === 'director' ? 'fill-emerald-600' : 'fill-amber-600'
              } group-hover:r-28`} 
            />
            <circle r="30" className="fill-none stroke-white/10 stroke-1 animate-ping" style={{ animationDuration: '3s' }} />
            
            <text y="45" textAnchor="middle" className="text-[10px] font-black fill-white uppercase tracking-widest">{node.label}</text>
            {node.amount && <text y="58" textAnchor="middle" className="text-[8px] font-bold fill-slate-500">{node.amount}</text>}
            {node.percentage && <text y="58" textAnchor="middle" className="text-[8px] font-bold fill-emerald-400">{node.percentage} Own.</text>}
          </g>
        ))}
      </svg>
      
      <div className="absolute top-8 left-8 space-y-2">
         <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-indigo-600" />
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Institution Root</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-600" />
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Director/UBO</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-amber-600 animate-pulse" />
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">High Exposure Co.</span>
         </div>
      </div>
    </div>
  );
}
