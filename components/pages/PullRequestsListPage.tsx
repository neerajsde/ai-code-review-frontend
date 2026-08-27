"use client";
import { useEffect, useState } from "react";
import { pullRequests } from "@/lib/api";
import { GitPullRequest } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function PullRequestsListPage() {
  const [prs, setPrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pullRequests.list({ limit: 30 })
      .then((d) => setPrs(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pull Requests</h1>
        <p className="text-slate-400 mt-1">All reviewed pull requests</p>
      </div>
      <div className="rounded-xl bg-[#111118] border border-white/8 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-white/5">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 shimmer" />)}
          </div>
        ) : prs.length === 0 ? (
          <div className="p-12 text-center">
            <GitPullRequest className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No pull requests yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {prs.map((pr: any) => (
              <Link key={pr._id} href={`/pull-requests/${pr._id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors">
                <GitPullRequest className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">#{pr.number} {pr.title}</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {(pr.repositoryId as any)?.fullName} · {formatDistanceToNow(new Date(pr.updatedAt), { addSuffix: true })}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  pr.status === "OPEN" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                  pr.status === "MERGED" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" :
                  "bg-slate-500/15 text-slate-400 border-slate-500/30"
                }`}>{pr.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
