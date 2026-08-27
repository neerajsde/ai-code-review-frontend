import type { Metadata } from "next";
import { Zap, Shield, BarChart3, GitPullRequest } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

export const metadata: Metadata = {
  title: "Sign In | AI Code Review",
  description: "Sign in to AI Code Review with your GitHub account",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

const features = [
  { icon: Zap, title: "Instant Reviews", desc: "AI reviews your PRs automatically on every push" },
  { icon: Shield, title: "Security First", desc: "Detects vulnerabilities, secrets, and auth issues" },
  { icon: BarChart3, title: "Quality Metrics", desc: "Track code quality trends across repositories" },
  { icon: GitPullRequest, title: "GitHub Native", desc: "Inline comments posted directly to your PRs" },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Gradient orb */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">AI Code Review</span>
          </div>
          <p className="text-slate-500 text-sm">Powered by advanced AI</p>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Code reviews that{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              never sleep
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-12">
            Get actionable AI feedback on every Pull Request — security, bugs, performance, and more.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/8 transition-colors"
              >
                <f.icon className="w-5 h-5 text-violet-400 mb-2" />
                <div className="text-white font-semibold text-sm mb-1">{f.title}</div>
                <div className="text-slate-400 text-xs">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-600 text-xs">
          © {new Date().getFullYear()} AI Code Review. Built for developers.
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">AI Code Review</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400">Sign in with GitHub to continue</p>
          </div>

          <a
            href={`${API_URL}/auth/github`}
            className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <GithubIcon className="w-5 h-5" />
            Continue with GitHub
          </a>

          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-slate-400 text-sm text-center">
              By signing in, you agree to our{" "}
              <span className="text-violet-400 cursor-pointer hover:underline">Terms of Service</span>{" "}
              and{" "}
              <span className="text-violet-400 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {["Security-first", "No storage of code", "GDPR compliant"].map((t) => (
              <div key={t} className="text-slate-500 text-xs">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mx-auto mb-1" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
