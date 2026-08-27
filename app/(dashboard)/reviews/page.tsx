import type { Metadata } from "next";
import { ReviewsListPage } from "@/components/pages/ReviewsListPage";

export const metadata: Metadata = { title: "Reviews" };

export default function Page() {
  return <ReviewsListPage />;
}
