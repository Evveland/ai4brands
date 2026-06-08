"use client";

import { useEffect } from "react";
import { useAppState, useNav } from "@/lib/store";

const INNER_SCREENS = new Set([
  "role-matrix", "role-database", "quest-profile", "capabilities-page",
  "pilot-page", "invite-page", "challenge-detail", "challenge-response",
  "challenge-retail", "challenge-agency", "challenge-create", "startup-detail",
  "startup-ugc", "startup-match", "meeting-page", "agency-dashboard",
  "ecosystem-dashboard", "ecosystem-detail", "founder-challenge", "event-page",
  "ecosystem-challenge", "sponsor-page", "access-flow", "award-content-ai",
  "award-cx-ai", "award-ecosystem", "awards-vote", "awards-recommend",
  "profile-page", "promotion-page", "challenge-page", "badges-page",
  "community-page", "agency-quest-page", "brand-quest-page",
  "institutional-quest-page", "role-quest",
  "startup-quest", "agency-quest", "brand-quest", "institutional-quest",
]);

/**
 * Wires Telegram WebApp native features:
 * - BackButton: shown on inner screens, fires our app's back()
 * - MainButton: can be used later per-screen
 * - Sets app background color to match our dark theme
 */
export function TelegramInit() {
  const { screen } = useAppState();
  const { back } = useNav();

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    // Set Telegram UI colors to match the app
    tg.setHeaderColor?.("#0A0D18");
    tg.setBackgroundColor?.("#0A0D18");

    // Show/hide native back button based on screen depth
    if (INNER_SCREENS.has(screen)) {
      tg.BackButton?.show();
    } else {
      tg.BackButton?.hide();
    }
  }, [screen]);

  // Wire back button once on mount
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    const handler = () => back();
    tg.BackButton?.onClick?.(handler);
    return () => tg.BackButton?.offClick?.(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
