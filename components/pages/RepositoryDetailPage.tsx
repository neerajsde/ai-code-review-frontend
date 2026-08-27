"use client";
import { useEffect, useState } from "react";
import { repositories, settings } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/notificationSlice";
import { ArrowLeft, GitFork, Power, PowerOff } from "lucide-react";
import Link from "next/link";

export function RepositoryDetailPage({ repositoryId }: { repositoryId: string }) {
  const dispatch = useAppDispatch();
  const [repo, setRepo] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      repositories.get(repositoryId),
      repositories.stats(repositoryId),
      settings.getReviewSettings(repositoryId),
    ]).then(([r, s, c]) => { setRepo(r); setStats(s); setConfig(c); })
      .catch(() => dispatch(addNotification({ type: "error", message: "Failed to load repository" })))
      .finally(() => setLoading(false));
  }, [repositoryId]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await settings.updateReviewSettings(repositoryId, config);
      dispatch(addNotification({ type: "success", message: "Settings saved" }));
    } catch {
      dispatch(addNotification({ type: "error", message: "Failed to save settings" }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 shimmer rounded-xl" />;
  if (!repo) return <div className="text-slate-400">Repository not found</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/repositories" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to repositories
      </Link>

      <div className="rounded-xl bg-[#111118] border border-white/8 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center">
            <GitFork className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{repo.fullName}</h1>
            <p className="text-slate-400 text-sm">{repo.language} · {repo.defaultBranch}</p>
          </div>
        </div>
        {stats && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <div className="text-center"><div className="text-xl font-bold text-white">{stats.totalReviews}</div><div className="text-slate-500 text-xs">Reviews</div></div>
            <div className="text-center"><div className="text-xl font-bold text-white">{stats.completedReviews}</div><div className="text-slate-500 text-xs">Completed</div></div>
            <div className="text-center"><div className={`text-xl font-bold ${stats.avgScore >= 80 ? "text-emerald-400" : stats.avgScore >= 60 ? "text-amber-400" : "text-red-400"}`}>{stats.avgScore ?? "—"}</div><div className="text-slate-500 text-xs">Avg Score</div></div>
          </div>
        )}
      </div>

      {config && (
        <div className="rounded-xl bg-[#111118] border border-white/8 p-6 space-y-4">
          <h2 className="text-white font-semibold">Review Settings</h2>
          {([
            { key: "reviewOnOpen", label: "Review on PR Open" },
            { key: "reviewOnSync", label: "Review on new commits" },
            { key: "reviewDraftPRs", label: "Review draft PRs" },
          ] as const).map((s) => (
            <label key={s.key} className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300 text-sm">{s.label}</span>
              <button
                onClick={() => setConfig((c: any) => ({ ...c, [s.key]: !c[s.key] }))}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  config[s.key] ? "bg-violet-600" : "bg-white/10"
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  config[s.key] ? "translate-x-5" : "translate-x-0.5"
                }`} />
              </button>
            </label>
          ))}
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      )}
    </div>
  );
}
