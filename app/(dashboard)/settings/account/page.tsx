import type { Metadata } from "next";
export const metadata: Metadata = { title: "Account Settings" };
import { AccountSettingsPage } from "@/components/pages/AccountSettingsPage";
export default function Page() { return <AccountSettingsPage />; }
