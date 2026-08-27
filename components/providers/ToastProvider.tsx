"use client";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeNotification } from "@/store/notificationSlice";
import { useEffect } from "react";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((s) => s.notifications.notifications);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-3 rounded-xl px-4 py-3 shadow-2xl text-sm font-medium border backdrop-blur-sm animate-in slide-in-from-right-5 ${
              n.type === "success" ? "bg-emerald-900/90 border-emerald-700 text-emerald-100" :
              n.type === "error" ? "bg-red-900/90 border-red-700 text-red-100" :
              n.type === "warning" ? "bg-amber-900/90 border-amber-700 text-amber-100" :
              "bg-slate-800/90 border-slate-700 text-slate-100"
            }`}
          >
            <span className="flex-1">{n.message}</span>
            <button
              onClick={() => dispatch(removeNotification(n.id))}
              className="opacity-60 hover:opacity-100 transition-opacity ml-2 text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
