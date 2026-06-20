type MetricBarProps = {
  label: string;
  value: string;
  width: string;
  tone?: "cyan" | "red" | "lime";
};

const toneClasses = {
  cyan: "from-pit-cyan to-sky-300",
  red: "from-pit-red to-rose-300",
  lime: "from-pit-lime to-emerald-300",
};

export function MetricBar({ label, value, width, tone = "cyan" }: MetricBarProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono text-slate-100">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${toneClasses[tone]}`}
          style={{ width }}
        />
      </div>
    </div>
  );
}
