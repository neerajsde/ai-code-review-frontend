import type { Metadata } from "next";
import { ReviewDetailPage } from "@/components/pages/ReviewDetailPage";

export const metadata: Metadata = { title: "Review Details" };

export default function Page({ params }: { params: { id: string } }) {
  return <ReviewDetailPage reviewId={params.id} />;
}
