"use client";
import { useEffect, useState } from "react";
import { repositories, github } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/notificationSlice";
import { GitFork, Plus, RefreshCw, Power, PowerOff, ExternalLink } from "lucide-react";
import Link from "next/link";

export function RepositoriesPage() {
  const dispatch = useAppDispatch();
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [installUrl, setInstallUrl] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [reposData, urlData] = await Promise.all([
        repositories.list({ limit: 50 }),
        github.installUrl().catch(() => null),
      ]);
      setRepos(reposData.data ?? []);
      setInstallUrl(urlData);
    } catch (e) {
      dispatch(addNotification({ type: "error", message: "Failed to load repositories" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleToggleReview = async (repo: any) => {
    setToggling(repo._id);
    try {
      const updated = await repositories.update(repo._id, { reviewEnabled: !repo.reviewEnabled });
      setRepos((prev) => prev.map((r) => r._id === repo._id ? updated : r));
      dispatch(addNotification({ type: "success", message: `Reviews ${updated.reviewEnabled ? "enabled" : "disabled"} for ${repo.name}` }));
    } catch {
      dispatch(addNotification({ type: "error", message: "Failed to update repository" }));
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 shimmer rounded-lg" />
        {[...Array(4)].map((_, i) => <div key={i} className="h-20 shimmer rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Repositories</h1>
          <p className="text-slate-400 mt-1">{repos.length} connected</p>
        </div>
        {installUrl && (
          <a
            href={installUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Connect More
          </a>
        )}
      </div>

      {repos.length === 0 ? (
        <div className="rounded-xl border border-white/8 bg-[#111118] p-16 text-center">
          <GitFork className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-white font-semibold text-lg mb-2">No repositories connected</h2>
          <p className="text-slate-400 mb-6">Install the GitHub App to start reviewing pull requests</p>
          {installUrl && (
            <a
              href={installUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Install GitHub App
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {repos.map((repo) => (
            <div key={repo._id} className="rounded-xl bg-[#111118] border border-white/8 p-5 flex items-center gap-4 hover:border-white/15 transition-colors">
              <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <GitFork className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link href={`/repositories/${repo._id}`} className="text-white font-semibold hover:text-violet-300 transition-colors truncate">
                    {repo.fullName}
                  </Link>
                  {repo.private && <span className="text-xs text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">Private</span>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  {repo.language && <span>{repo.language}</span>}
                  <span>{repo.defaultBranch}</span>
                  {repo.lastReviewedAt && <span>Last reviewed {new Date(repo.lastReviewedAt).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors p-2">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleToggleReview(repo)}
                  disabled={toggling === repo._id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    repo.reviewEnabled
                      ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {repo.reviewEnabled ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                  {repo.reviewEnabled ? "Active" : "Disabled"}
                </button>
                <Link href={`/repositories/${repo._id}`} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-300 hover:bg-white/10 transition-colors border border-white/10">
                  Settings
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
