import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ai4brands-teal.vercel.app";
const WEBHOOK_URL = `${APP_URL}/api/telegram/webhook`;

// GET /api/telegram/setup — registers webhook + sets bot commands
// Protected: requires ?secret=ADMIN_SECRET
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET && secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });
  }

  // 1. Register webhook
  const whRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ["message", "callback_query"],
        drop_pending_updates: true,
      }),
    }
  );
  const whData = await whRes.json();

  // 2. Set bot commands
  const cmdRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commands: [
          { command: "start",   description: "Abrir AI4Brands MiniApp" },
          { command: "quest",   description: "Ver tu Quest activo" },
          { command: "retos",   description: "Ver challenges activos" },
          { command: "ranking", description: "Ranking en tiempo real" },
          { command: "help",    description: "Comandos disponibles" },
        ],
      }),
    }
  );
  const cmdData = await cmdRes.json();

  // 3. Set menu button (opens the MiniApp directly)
  const menuRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menu_button: {
          type: "web_app",
          text: "Abrir AI4Brands",
          web_app: { url: APP_URL },
        },
      }),
    }
  );
  const menuData = await menuRes.json();

  // 4. Get webhook info to confirm
  const infoRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`
  );
  const infoData = await infoRes.json();

  return NextResponse.json({
    webhook: whData,
    commands: cmdData,
    menu_button: menuData,
    webhook_info: infoData,
  });
}
