import type { Metadata } from "next";
import { RepositoriesPage } from "@/components/pages/RepositoriesPage";

export const metadata: Metadata = { title: "Repositories" };

export default function Page() {
  return <RepositoriesPage />;
}
