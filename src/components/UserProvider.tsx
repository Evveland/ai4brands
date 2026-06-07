"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getOrCreateUser } from "@/lib/db";
import { useAppState, useDispatch } from "@/lib/store";

interface DBUser {
  id: string;
  telegram_id: number;
  role: string | null;
  xp: number;
  badges: string[];
}

const UserCtx = createContext<DBUser | null>(null);

export function useDBUser() {
  return useContext(UserCtx);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const { role, xp, badges } = useAppState();
  const dispatch = useDispatch();

  useEffect(() => {
    getOrCreateUser().then((user) => {
      if (!user) return;
      setDbUser(user);
      // Sync DB state → local state on first load
      if (user.role && !role) {
        dispatch({ type: "SET_ROLE", role: user.role as any });
      }
      if (user.xp > xp) {
        dispatch({ type: "ADD_XP", amount: user.xp - xp });
      }
      if (user.badges?.length) {
        user.badges.forEach((b: string) => dispatch({ type: "ADD_BADGE", badge: b }));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <UserCtx.Provider value={dbUser}>{children}</UserCtx.Provider>;
}
