import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ai4brands-teal.vercel.app";

async function sendMessage(chatId: number, text: string, extra?: object) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", ...extra }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message ?? body.callback_query?.message;
    const chatId: number = message?.chat?.id;
    const text: string = message?.text ?? "";
    const from = message?.from ?? body.callback_query?.from;

    if (!chatId) return NextResponse.json({ ok: true });

    const firstName = from?.first_name ?? "there";

    // /start command — welcome + open MiniApp button
    if (text.startsWith("/start")) {
      const refCode = text.split(" ")[1] ?? null; // deep-link code e.g. /start eco_madrid

      await sendMessage(chatId,
        `👋 <b>Hola ${firstName}!</b>\n\n` +
        `Bienvenido a <b>AI4Brands Innovation League</b> 🚀\n\n` +
        `Conecta startups de IA, agencias y marcas. Gana XP completando misiones reales antes del evento.\n\n` +
        `Pulsa el botón para abrir la MiniApp y elegir tu camino:`,
        {
          reply_markup: {
            inline_keyboard: [[
              {
                text: "🚀 Abrir AI4Brands",
                web_app: { url: refCode ? `${APP_URL}?ref=${refCode}` : APP_URL },
              },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // /help
    if (text === "/help") {
      await sendMessage(chatId,
        `<b>AI4Brands — Comandos</b>\n\n` +
        `/start — Abrir la MiniApp\n` +
        `/quest — Ver tu Quest activo\n` +
        `/ranking — Ver el ranking en tiempo real\n` +
        `/retos — Ver challenges activos`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: "Abrir MiniApp", web_app: { url: APP_URL } },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // /quest
    if (text === "/quest") {
      await sendMessage(chatId,
        `🎯 <b>Tu Quest</b>\n\nAbre la MiniApp para ver tu progreso, completar pasos y ganar XP.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: "🚀 Ver mi Quest", web_app: { url: `${APP_URL}` } },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // /ranking
    if (text === "/ranking") {
      await sendMessage(chatId,
        `🏆 <b>Ranking en vivo</b>\n\nVe quién lidera el Innovation League y cómo escalar posiciones.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: "Ver ranking completo", web_app: { url: APP_URL } },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // /retos
    if (text === "/retos") {
      await sendMessage(chatId,
        `⚡ <b>Challenges activos</b>\n\nResponde un Brand Challenge para ganar XP y entrar en el shortlist.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: "Ver challenges", web_app: { url: APP_URL } },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // Default: nudge towards the app
    await sendMessage(chatId,
      `Usa el botón de abajo para abrir AI4Brands 👇`,
      {
        reply_markup: {
          keyboard: [[{ text: "🚀 Abrir AI4Brands", web_app: { url: APP_URL } }]],
          resize_keyboard: true,
        },
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}

// Telegram needs GET to verify the endpoint is alive
export function GET() {
  return NextResponse.json({ ok: true, service: "AI4Brands Telegram Bot" });
}
