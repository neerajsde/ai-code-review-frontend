"use client";
import { useEffect, useState } from "react";
import { reviews } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ClipboardCheck, AlertTriangle, Filter } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const STATUS_OPTIONS = ["All", "COMPLETED", "PROCESSING", "QUEUED", "FAILED"];

export function ReviewsListPage() {
  const [reviewList, setReviewList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviews.list({
        page,
        limit: 20,
        ...(statusFilter !== "All" && { status: statusFilter }),
      });
      setReviewList(data.data ?? []);
      setTotalPages(data.pagination?.pages ?? 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, [page, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reviews</h1>
          <p className="text-slate-400 mt-1">All AI code reviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              statusFilter === s
                ? "bg-violet-600 text-white"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-[#111118] border border-white/8 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-white/5">
            {[...Array(5)].map((_, i) => <div key={i} className="h-20 shimmer" />)}
          </div>
        ) : reviewList.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No reviews found</p>
            <p className="text-slate-600 text-sm mt-1">Trigger a review from a repository or wait for a webhook</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {reviewList.map((review: any) => (
              <Link
                key={review._id}
                href={`/reviews/${review._id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors"
              >
                <StatusBadge status={review.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium truncate">
                      {(review.repositoryId as any)?.fullName ?? "Unknown"}
                    </span>
                    <span className="text-slate-600 text-xs flex-shrink-0">
                      PR #{(review.pullRequestId as any)?.number}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                    <span>{review.trigger}</span>
                    <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                    {review.filesReviewed > 0 && <span>{review.filesReviewed} files</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {review.totalFindings > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-300">{review.totalFindings}</span>
                    </div>
                  )}
                  {review.score != null && (
                    <div className={`text-sm font-bold min-w-[3rem] text-right ${
                      review.score >= 80 ? "text-emerald-400" :
                      review.score >= 60 ? "text-amber-400" : "text-red-400"
                    }`}>
                      {review.score}/100
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-slate-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-slate-400 text-sm">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-slate-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
