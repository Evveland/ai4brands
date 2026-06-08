"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getOrCreateUser } from "@/lib/db";
import { useDispatch } from "@/lib/store";

export interface DBUser {
  id: string;
  telegram_id: number;
  telegram_handle: string | null;
  first_name: string | null;
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
  const dispatch = useDispatch();

  useEffect(() => {
    getOrCreateUser().then((user) => {
      if (!user) return;
      setDbUser(user as DBUser);

      // Always sync DB → local state (DB is source of truth)
      if (user.role) {
        dispatch({ type: "SET_ROLE", role: user.role as any });
      }
      // Set XP to exact DB value
      if ((user.xp ?? 0) > 0) {
        dispatch({ type: "ADD_XP", amount: user.xp });
      }
      // Sync all badges
      if (user.badges?.length) {
        user.badges.forEach((b: string) => dispatch({ type: "ADD_BADGE", badge: b }));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <UserCtx.Provider value={dbUser}>{children}</UserCtx.Provider>;
}
