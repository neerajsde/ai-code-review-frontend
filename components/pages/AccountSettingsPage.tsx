"use client";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/authSlice";
import { addNotification } from "@/store/notificationSlice";
import { settings } from "@/lib/api";
import Image from "next/image";
import { User } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

export function AccountSettingsPage() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await settings.updateAccount({ displayName });
      dispatch(setUser(updated));
      dispatch(addNotification({ type: "success", message: "Profile updated" }));
    } catch {
      dispatch(addNotification({ type: "error", message: "Failed to update profile" }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account</p>
      </div>

      <div className="rounded-xl bg-[#111118] border border-white/8 p-6 space-y-5">
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <Image src={user.avatarUrl} alt={user.displayName} width={64} height={64} className="rounded-full ring-2 ring-violet-500/30" />
          ) : (
            <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          <div>
            <div className="text-white font-semibold">{user?.displayName}</div>
            <div className="text-slate-400 text-sm flex items-center gap-1.5">
              <GithubIcon className="w-3.5 h-3.5" />
              @{user?.username}
            </div>
          </div>
        </div>

        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">Email</label>
          <div className="px-3 py-2.5 bg-white/3 border border-white/5 rounded-lg text-slate-400 text-sm">
            {user?.email ?? "No email available"}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !displayName.trim()}
          className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
