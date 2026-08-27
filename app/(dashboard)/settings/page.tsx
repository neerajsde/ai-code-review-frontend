import type { Metadata } from "next";
export const metadata: Metadata = { title: "Settings" };
import { redirect } from "next/navigation";
export default function Page() { redirect("/settings/account"); }
