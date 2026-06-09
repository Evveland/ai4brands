import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-05-27.dahlia" });
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ai4brands-teal.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const { productId, userId } = await req.json();
    if (!productId || !userId) {
      return NextResponse.json({ error: "Missing productId or userId" }, { status: 400 });
    }

    // Get product
    const supabase = await createClient();
    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (!product || !product.fiat_price_cents) {
      return NextResponse.json({ error: "Product not found or not available for fiat" }, { status: 404 });
    }

    // Create Stripe checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        product.stripe_price_id
          ? { price: product.stripe_price_id, quantity: 1 }
          : {
              price_data: {
                currency: "eur",
                product_data: {
                  name: product.name,
                  description: product.description ?? undefined,
                },
                unit_amount: product.fiat_price_cents,
              },
              quantity: 1,
            },
      ],
      mode: "payment",
      success_url: `${APP_URL}?purchase=success&product=${productId}`,
      cancel_url: `${APP_URL}?purchase=cancelled`,
      metadata: { userId, productId },
    });

    // Create pending purchase record
    await supabase.from("purchases").insert([{
      user_id: userId,
      product_id: productId,
      payment_method: "stripe",
      status: "pending",
      amount_cents: product.fiat_price_cents,
      stripe_session_id: session.id,
    }]);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
