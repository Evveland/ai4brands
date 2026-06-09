import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI4Brands Innovation League",
  description:
    "Conecta startups de IA, agencias de marketing y grandes marcas. Gana XP con misiones reales.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Telegram MiniApp SDK — synchronous so initDataUnsafe is populated before React hydrates */}
        <script src="https://telegram.org/js/telegram-web-app.js" />
        {/* Call ready() immediately after SDK loads so Telegram populates initDataUnsafe */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (window.Telegram && window.Telegram.WebApp) {
              window.Telegram.WebApp.ready();
              window.Telegram.WebApp.expand();
            }
          `
        }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
