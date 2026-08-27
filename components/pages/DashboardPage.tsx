"use client";
import { useEffect, useState } from "react";
import { reviews } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { BarChart3, GitPullRequest, Shield, Zap, TrendingUp, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface DashboardStats {
  totalReviews: number;
  reviewsThisMonth: number;
  totalRepositories: number;
  completedReviews: number;
  failedReviews: number;
  avgScore: number | null;
  totalCriticalFindings: number;
  totalHighFindings: number;
  reviewsOverTime: Array<{ _id: string; count: number; avgScore: number | null }>;
}

function StatCard({ icon: Icon, label, value, sub, color = "violet" }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  const colors = {
    violet: "from-violet-600/20 to-violet-600/5 border-violet-500/20 text-violet-400",
    blue: "from-blue-600/20 to-blue-600/5 border-blue-500/20 text-blue-400",
    emerald: "from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
    amber: "from-amber-600/20 to-amber-600/5 border-amber-500/20 text-amber-400",
    red: "from-red-600/20 to-red-600/5 border-red-500/20 text-red-400",
  } as Record<string, string>;

  return (
    <div className={`rounded-xl bg-gradient-to-br ${colors[color]} border p-5`}>
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-5 h-5" />
        {sub && <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{sub}</span>}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}

export function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, reviewsData] = await Promise.all([
          reviews.dashboardStats(),
          reviews.list({ limit: 5 }),
        ]);
        setStats(statsData);
        setRecentReviews(reviewsData.data ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 shimmer rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 shimmer rounded-xl" />)}
        </div>
        <div className="h-64 shimmer rounded-xl" />
      </div>
    );
  }

  const chartData = stats?.reviewsOverTime?.map((d) => ({
    date: d._id,
    reviews: d.count,
    score: d.avgScore ? Math.round(d.avgScore) : null,
  })) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.displayName?.split(" ")[0] ?? user?.username} 👋
        </h1>
        <p className="text-slate-400 mt-1">Here&apos;s what&apos;s happening with your repositories</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BarChart3} label="Total Reviews" value={stats?.totalReviews ?? 0} color="violet" />
        <StatCard icon={GitPullRequest} label="This Month" value={stats?.reviewsThisMonth ?? 0} color="blue" />
        <StatCard icon={CheckCircle2} label="Avg Score" value={stats?.avgScore != null ? `${stats.avgScore}/100` : "—"} color="emerald" />
        <StatCard icon={Shield} label="Critical Issues" value={stats?.totalCriticalFindings ?? 0} color="red" />
      </div>

      {/* Chart */}
      <div className="rounded-xl bg-[#111118] border border-white/8 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold">Reviews over time</h2>
            <p className="text-slate-500 text-sm">Last 30 days</p>
          </div>
          <TrendingUp className="w-5 h-5 text-violet-400" />
        </div>
        {chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No review data yet</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="reviewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#f8fafc" }}
              />
              <Area type="monotone" dataKey="reviews" stroke="#7c3aed" strokeWidth={2} fill="url(#reviewGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent reviews */}
      <div className="rounded-xl bg-[#111118] border border-white/8">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-white font-semibold">Recent Reviews</h2>
          <Link href="/reviews" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
            View all →
          </Link>
        </div>
        {recentReviews.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardCheckIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No reviews yet</p>
            <p className="text-slate-600 text-sm mt-1">Connect a repository and open a Pull Request to get started</p>
            <Link href="/repositories" className="mt-4 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
              Connect repository →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentReviews.map((review: any) => (
              <Link
                key={review._id}
                href={`/reviews/${review._id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors"
              >
                <StatusBadge status={review.status} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {(review.repositoryId as any)?.fullName ?? "Unknown repo"}
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    PR #{(review.pullRequestId as any)?.number} · {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </div>
                </div>
                {review.score != null && (
                  <div className={`text-sm font-bold ${
                    review.score >= 80 ? "text-emerald-400" : review.score >= 60 ? "text-amber-400" : "text-red-400"
                  }`}>
                    {review.score}/100
                  </div>
                )}
                {review.totalFindings > 0 && (
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    {review.totalFindings}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClipboardCheckIcon({ className }: { className?: string }) {
  return <CheckCircle2 className={className} />;
}
