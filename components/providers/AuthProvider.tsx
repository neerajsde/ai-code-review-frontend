"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setLoading } from "@/store/authSlice";
import { auth } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        dispatch(setLoading(true));
        const user = await auth.me();
        dispatch(setUser(user));
      } catch {
        dispatch(setUser(null));
      }
    };
    loadUser();
  }, [dispatch]);

  return <>{children}</>;
}
