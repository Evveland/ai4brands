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
    getOrCreateUser().then(async (user) => {
      if (!user) return;
      setDbUser(user as DBUser);

      // Always sync DB → local state (DB is source of truth)
      if (user.role) {
        dispatch({ type: "SET_ROLE", role: user.role as any });
      }
      if ((user.xp ?? 0) > 0) {
        dispatch({ type: "ADD_XP", amount: user.xp });
      }
      if (user.badges?.length) {
        user.badges.forEach((b: string) => dispatch({ type: "ADD_BADGE", badge: b }));
      }

      // Handle referral deep link: startapp=ref_{inviterUserId}_{role}
      const startParam =
        (window as any).Telegram?.WebApp?.initDataUnsafe?.start_param ?? null;
      if (startParam && typeof startParam === "string" && startParam.startsWith("ref_")) {
        const parts = startParam.split("_"); // ["ref", userId, role]
        const inviterUserId = parts[1];
        const suggestedRole = parts[2];

        if (inviterUserId && inviterUserId !== user.id) {
          // Record the referral: increment uses on the inviter's invitation
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          // Update the invitation record for this inviter+role
          const { data: inv } = await supabase
            .from("invitations")
            .select("id, uses")
            .eq("inviter_id", inviterUserId)
            .eq("ecosystem_tag", suggestedRole ?? "startup")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (inv) {
            await supabase
              .from("invitations")
              .update({ uses: (inv.uses ?? 0) + 1 })
              .eq("id", inv.id);
          }

          // Pre-suggest role if user hasn't chosen one
          if (!user.role && suggestedRole) {
            dispatch({ type: "SET_ROLE", role: suggestedRole as any });
          }
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <UserCtx.Provider value={dbUser}>{children}</UserCtx.Provider>;
}
