import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  note?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accent?: string;
}

export function MetricCard({ label, value, note, icon: Icon, trend, accent }: MetricCardProps) {
  return (
    <div className="surface-card p-6 border-t-2 border-t-slate-200/50 hover:border-t-blue-600 transition-all flex flex-col bg-white rounded-[24px] shadow-sm border border-slate-200 relative overflow-hidden group">
      {accent && <div className={`absolute top-0 left-0 w-full h-[3px] ${accent}`} />}
      
      <div className="flex items-start justify-between mb-4">
        <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${accent ? `bg-slate-50 group-hover:${accent}/10` : 'bg-slate-50'}`}>
          {Icon && <Icon className={`h-5 w-5 ${accent ? accent.replace('bg-', 'text-') : 'text-slate-400'}`} />}
        </div>
        {trend && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend.value}
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">{label}</p>
        <p className="text-3xl font-bold text-slate-900 tracking-tight leading-none">{value}</p>
      </div>

      {note && (
        <p className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed font-medium">
          {note}
        </p>
      )}
    </div>
  );
}
