import type { Metadata } from "next";
export const metadata: Metadata = { title: "Repository" };
import { RepositoryDetailPage } from "@/components/pages/RepositoryDetailPage";
export default function Page({ params }: { params: { id: string } }) { return <RepositoryDetailPage repositoryId={params.id} />; }
