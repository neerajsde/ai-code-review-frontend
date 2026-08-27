type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

const config: Record<Severity, { label: string; classes: string }> = {
  CRITICAL: { label: "Critical", classes: "bg-red-500/15 text-red-400 border-red-500/30" },
  HIGH: { label: "High", classes: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  MEDIUM: { label: "Medium", classes: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  LOW: { label: "Low", classes: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  INFO: { label: "Info", classes: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
};

export function SeverityBadge({ severity }: { severity: string }) {
  const c = config[severity as Severity] ?? config.INFO;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${c.classes}`}>
      {c.label}
    </span>
  );
}
