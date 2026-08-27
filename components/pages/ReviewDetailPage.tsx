"use client";
import { useEffect, useState } from "react";
import { reviews } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/notificationSlice";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import {
  ArrowLeft, RefreshCw, ExternalLink, FileCode, AlertTriangle,
  Shield, Zap, Bug, Code2, Filter,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const SEVERITY_FILTERS = ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];
const CATEGORY_FILTERS = ["All", "BUG", "SECURITY", "PERFORMANCE", "CODE_QUALITY", "ERROR_HANDLING"];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  SECURITY: Shield,
  BUG: Bug,
  PERFORMANCE: Zap,
  CODE_QUALITY: Code2,
  DEFAULT: AlertTriangle,
};

export function ReviewDetailPage({ reviewId }: { reviewId: string }) {
  const dispatch = useAppDispatch();
  const [review, setReview] = useState<any>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const loadData = async () => {
    try {
      const [reviewData, findingsData] = await Promise.all([
        reviews.get(reviewId),
        reviews.findings(reviewId),
      ]);
      setReview(reviewData);
      setFindings(findingsData);
    } catch {
      dispatch(addNotification({ type: "error", message: "Failed to load review" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [reviewId]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await reviews.retry(reviewId);
      dispatch(addNotification({ type: "success", message: "Review retry queued" }));
      await loadData();
    } catch {
      dispatch(addNotification({ type: "error", message: "Failed to retry review" }));
    } finally {
      setRetrying(false);
    }
  };

  const filteredFindings = findings.filter((f) => {
    if (severityFilter !== "All" && f.severity !== severityFilter) return false;
    if (categoryFilter !== "All" && f.category !== categoryFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 shimmer rounded-lg" />
        <div className="h-48 shimmer rounded-xl" />
        <div className="h-96 shimmer rounded-xl" />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Review not found</p>
        <Link href="/reviews" className="text-violet-400 text-sm mt-2 block hover:underline">← Back to reviews</Link>
      </div>
    );
  }

  const repo = review.repositoryId as any;
  const pr = review.pullRequestId as any;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/reviews" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to reviews
      </Link>

      <div className="rounded-xl bg-[#111118] border border-white/8 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={review.status} />
              <span className="text-slate-500 text-sm">{review.trigger}</span>
              <span className="text-slate-600 text-sm">·</span>
              <span className="text-slate-500 text-sm">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">
              {repo?.fullName ?? "Unknown"} — PR #{pr?.number}
            </h1>
            {pr?.title && <p className="text-slate-400 mt-1">{pr.title}</p>}
            {review.summary && <p className="text-slate-300 mt-3 text-sm leading-relaxed">{review.summary}</p>}
          </div>
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            {review.score != null && (
              <div className={`text-4xl font-bold ${
                review.score >= 80 ? "text-emerald-400" :
                review.score >= 60 ? "text-amber-400" : "text-red-400"
              }`}>
                {review.score}
                <span className="text-lg text-slate-500">/100</span>
              </div>
            )}
            {review.status === "FAILED" && (
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${retrying ? "animate-spin" : ""}`} />
                Retry
              </button>
            )}
            {review.githubReviewUrl && (
              <a
                href={review.githubReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View on GitHub
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
          {[
            { label: "Files", value: review.filesReviewed ?? 0 },
            { label: "Findings", value: review.totalFindings ?? 0 },
            { label: "Critical", value: review.criticalFindings ?? 0 },
            { label: "High", value: review.highFindings ?? 0 },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {findings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Findings ({filteredFindings.length})</h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              {SEVERITY_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    severityFilter === s ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-3.5 h-3.5 flex-shrink-0" />
              {CATEGORY_FILTERS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    categoryFilter === c ? "bg-blue-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {c.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFindings.map((finding: any) => {
              const Icon = CATEGORY_ICONS[finding.category] ?? CATEGORY_ICONS.DEFAULT;
              return (
                <div key={finding._id} className="rounded-xl bg-[#111118] border border-white/8 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <SeverityBadge severity={finding.severity} />
                        <span className="text-slate-500 text-xs bg-white/5 px-2 py-0.5 rounded">
                          {finding.category.replace("_", " ")}
                        </span>
                        <span className="text-slate-600 text-xs ml-auto">
                          {Math.round(finding.confidence * 100)}% confidence
                        </span>
                      </div>
                      <h3 className="text-white font-medium text-sm mb-1">{finding.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{finding.description}</p>

                      {finding.filePath && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs">
                          <FileCode className="w-3.5 h-3.5 text-slate-500" />
                          <code className="text-violet-400">{finding.filePath}</code>
                          {finding.lineStart && (
                            <span className="text-slate-600">:{finding.lineStart}</span>
                          )}
                        </div>
                      )}

                      {finding.suggestion && (
                        <div className="mt-3 p-3 rounded-lg bg-emerald-950/50 border border-emerald-800/30">
                          <div className="text-emerald-400 text-xs font-semibold mb-1">Suggested Fix</div>
                          <p className="text-emerald-200/80 text-sm">{finding.suggestion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {review.error && (
        <div className="rounded-xl bg-red-950/30 border border-red-800/30 p-5">
          <div className="text-red-400 font-medium mb-1">Review Error</div>
          <p className="text-red-300/80 text-sm font-mono">{review.error}</p>
        </div>
      )}
    </div>
  );
}
