import type { Metadata } from "next";
export const metadata: Metadata = { title: "Pull Requests" };
import { PullRequestsListPage } from "@/components/pages/PullRequestsListPage";
export default function Page() { return <PullRequestsListPage />; }
