import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "AI Code Review",
    template: "%s | AI Code Review",
  },
  description: "Automated AI-powered code reviews for GitHub Pull Requests. Get actionable feedback, security analysis, and quality insights directly in your PR.",
  keywords: ["code review", "AI", "GitHub", "pull request", "static analysis"],
  openGraph: {
    title: "AI Code Review",
    description: "Automated AI-powered code reviews for GitHub Pull Requests",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <StoreProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
