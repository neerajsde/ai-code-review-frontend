type Status = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";

const config: Record<Status, { label: string; classes: string; dot: string }> = {
  QUEUED: { label: "Queued", classes: "bg-slate-500/15 text-slate-300 border-slate-500/30", dot: "bg-slate-400 animate-pulse" },
  PROCESSING: { label: "Processing", classes: "bg-blue-500/15 text-blue-300 border-blue-500/30", dot: "bg-blue-400 animate-pulse" },
  COMPLETED: { label: "Completed", classes: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
  FAILED: { label: "Failed", classes: "bg-red-500/15 text-red-300 border-red-500/30", dot: "bg-red-400" },
  CANCELLED: { label: "Cancelled", classes: "bg-slate-600/15 text-slate-400 border-slate-600/30", dot: "bg-slate-500" },
};

export function StatusBadge({ status }: { status: string }) {
  const c = config[status as Status] ?? config.QUEUED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${c.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
