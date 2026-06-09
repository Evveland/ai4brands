import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? "placeholder", { apiVersion: "2026-05-27.dahlia" });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, productId } = session.metadata ?? {};
    if (!userId || !productId) return NextResponse.json({ ok: true });

    const supabase = createServiceClient();

    // Mark purchase completed
    await supabase.from("purchases")
      .update({ status: "completed" })
      .eq("stripe_session_id", session.id);

    // Get product details
    const { data: product } = await supabase
      .from("products")
      .select("badge_unlocked, xp_price")
      .eq("id", productId)
      .single();

    if (product) {
      // Award badge if applicable
      if (product.badge_unlocked) {
        const { data: user } = await supabase
          .from("users")
          .select("badges")
          .eq("id", userId)
          .single();
        if (user && !user.badges.includes(product.badge_unlocked)) {
          await supabase.from("users")
            .update({ badges: [...user.badges, product.badge_unlocked] })
            .eq("id", userId);
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
