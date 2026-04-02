type MetricCardProps = {
  label: string;
  value: string;
  note: string;
  accent: string;
};

export function MetricCard({ label, value, note, accent }: MetricCardProps) {
  return (
    <article className="surface-card overflow-hidden">
      <div className={`h-1.5 w-full ${accent}`} />
      <div className="space-y-3 p-5">
        <p className="data-label">{label}</p>
        <p className="text-3xl font-semibold tracking-tight text-ink">{value}</p>
        <p className="text-sm leading-6 text-slate-600">{note}</p>
      </div>
    </article>
  );
}


