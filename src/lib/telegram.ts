export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function getTelegramUser(): TelegramUser | null {
  if (typeof window === "undefined") return null;
  const tg = (window as any).Telegram?.WebApp;
  return tg?.initDataUnsafe?.user ?? null;
}

export function isTelegramWebApp(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).Telegram?.WebApp?.initData;
}

export function expandTelegramApp() {
  if (typeof window === "undefined") return;
  (window as any).Telegram?.WebApp?.expand();
}

export function closeTelegramApp() {
  if (typeof window === "undefined") return;
  (window as any).Telegram?.WebApp?.close();
}
