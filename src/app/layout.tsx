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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Telegram MiniApp SDK — must load before React hydration */}
        <script src="https://telegram.org/js/telegram-web-app.js" />
        {/* Tell Telegram this is a full-screen app */}
        <meta name="telegram:web_app" content="fullscreen" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
