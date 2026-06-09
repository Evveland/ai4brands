"use client";

import { useState, useEffect } from "react";
import { useAppState, useDispatch } from "@/lib/store";
import { useDBUser } from "@/components/UserProvider";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  category: "access" | "visibility" | "badge" | "premium";
  xp_price: number | null;
  fiat_price_cents: number | null;
  badge_unlocked: string | null;
  sort_order: number;
  active: boolean;
}

interface Purchase { product_id: string; status: string; }

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  access:     { bg: "rgba(255,212,0,.15)",  text: "#FFD400", label: "Acceso" },
  visibility: { bg: "rgba(68,215,255,.15)", text: "#44D7FF", label: "Visibilidad" },
  badge:      { bg: "rgba(77,255,157,.15)", text: "#4DFF9D", label: "Badge" },
  premium:    { bg: "rgba(255,79,216,.15)", text: "#FF4FD8", label: "Premium" },
};

const categoryIcons: Record<string, string> = {
  access: "🎫", visibility: "📣", badge: "🏅", premium: "⭐",
};

function formatPrice(cents: number) {
  return `€${(cents / 100).toFixed(0)}`;
}

export function Store() {
  const { xp } = useAppState();
  const dispatch = useDispatch();
  const dbUser = useDBUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("products").select("*").eq("active", true).order("sort_order"),
      dbUser?.id ? supabase.from("purchases").select("product_id,status").eq("user_id", dbUser.id) : Promise.resolve({ data: [] }),
    ]).then(([prods, purch]) => {
      setProducts((prods.data ?? []) as Product[]);
      setPurchases((purch.data ?? []) as Purchase[]);
      setLoading(false);
    });
  }, [dbUser?.id]);

  function isPurchased(productId: string) {
    return purchases.some(p => p.product_id === productId && p.status === "completed");
  }

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function buyWithXP(product: Product) {
    if (!dbUser?.id || !product.xp_price) return;
    if (xp < product.xp_price) {
      showToast(`Necesitas ${product.xp_price.toLocaleString()} XP. Tienes ${xp.toLocaleString()}.`, false);
      return;
    }
    setBuying(product.id);
    const supabase = createClient();

    // Deduct XP
    const newXP = xp - product.xp_price;
    await supabase.from("users").update({ xp: newXP }).eq("id", dbUser.id);

    // Award badge if applicable
    if (product.badge_unlocked) {
      const { data: user } = await supabase.from("users").select("badges").eq("id", dbUser.id).single();
      if (user && !user.badges.includes(product.badge_unlocked)) {
        await supabase.from("users").update({ badges: [...user.badges, product.badge_unlocked] }).eq("id", dbUser.id);
        dispatch({ type: "ADD_BADGE", badge: product.badge_unlocked });
      }
    }

    // Record purchase
    await supabase.from("purchases").insert([{
      user_id: dbUser.id,
      product_id: product.id,
      payment_method: "xp",
      status: "completed",
      xp_spent: product.xp_price,
    }]);

    // Update local state
    dispatch({ type: "ADD_XP", amount: -product.xp_price });
    setPurchases(prev => [...prev, { product_id: product.id, status: "completed" }]);
    setBuying(null);
    showToast(`✓ ${product.name} desbloqueado con ${product.xp_price.toLocaleString()} XP`);
  }

  async function buyWithStripe(product: Product) {
    if (!dbUser?.id || !product.fiat_price_cents) return;
    setBuying(product.id);
    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, userId: dbUser.id }),
      });
      const { url, error } = await res.json();
      if (error) { showToast(error, false); setBuying(null); return; }
      window.open(url, "_blank");
    } catch {
      showToast("Error al conectar con el sistema de pago.", false);
    }
    setBuying(null);
  }

  const accessProducts = products.filter(p => p.category === "access");
  const otherProducts = products.filter(p => p.category !== "access");

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <div>
          <h3 className="m-0 text-[17px] font-bold tracking-tight">Tienda</h3>
          <p className="m-0 text-[11px] text-[var(--muted)] mt-0.5">Usa XP o paga con tarjeta</p>
        </div>
        <div className="rounded-full px-3 py-1.5 text-[12px] font-black"
          style={{ background: "rgba(255,212,0,.15)", color: "#FFD400" }}>
          {xp.toLocaleString()} XP
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="rounded-[14px] px-4 py-3 mb-4 text-[13px] font-semibold text-center transition-all"
          style={{ background: toast.ok ? "rgba(77,255,157,.15)" : "rgba(255,92,122,.15)", color: toast.ok ? "#4DFF9D" : "#FF5C7A" }}>
          {toast.msg}
        </div>
      )}

      {loading ? (
        <div className="grid gap-[10px]">
          {[1,2,3,4].map(i => <div key={i} className="rounded-[22px] h-[140px] animate-pulse" style={{ background: "rgba(255,255,255,.06)" }} />)}
        </div>
      ) : (
        <>
          {/* Access Route products */}
          {accessProducts.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3 mt-2">
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,.08)" }} />
                <span className="text-[10px] font-black text-[#737D9D] uppercase tracking-wider">Ruta de Acceso</span>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,.08)" }} />
              </div>
              <div className="grid gap-[10px] mb-5">
                {accessProducts.map((p, idx) => {
                  const bought = isPurchased(p.id);
                  const canAffordXP = p.xp_price !== null && xp >= p.xp_price;
                  const cc = categoryColors[p.category];
                  return (
                    <div key={p.id} className="rounded-[22px] border overflow-hidden"
                      style={{ background: bought ? "rgba(77,255,157,.07)" : "rgba(23,29,52,.86)", border: bought ? "1px solid rgba(77,255,157,.25)" : "1px solid rgba(255,255,255,.09)" }}>
                      {/* Product header */}
                      <div className="p-[14px] flex gap-3 items-start">
                        <div className="w-[44px] h-[44px] rounded-[14px] grid place-items-center text-[22px] flex-none"
                          style={{ background: bought ? "rgba(77,255,157,.15)" : cc.bg }}>
                          {bought ? "✓" : categoryIcons[p.category]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-black text-[14px]" style={{ color: bought ? "#4DFF9D" : "white" }}>
                              {p.name}
                            </span>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: cc.bg, color: cc.text }}>
                              Paso {idx + 1}
                            </span>
                          </div>
                          <p className="m-0 text-[12px] leading-snug" style={{ color: "#A9B1CB" }}>{p.description}</p>
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      {!bought && (
                        <div className="px-[14px] pb-[14px] border-t border-[rgba(255,255,255,.07)] pt-3"
                          style={{ borderColor: "rgba(255,255,255,.07)" }}>
                          <div className="flex gap-2 items-center">
                            {/* XP button */}
                            {p.xp_price !== null && (
                              <button
                                onClick={() => buyWithXP(p)}
                                disabled={buying === p.id || !canAffordXP}
                                className="flex-1 rounded-[14px] py-2.5 font-black text-[13px] border-0 cursor-pointer transition-all"
                                style={{
                                  background: canAffordXP ? "#FFD400" : "rgba(255,255,255,.07)",
                                  color: canAffordXP ? "#10131F" : "#737D9D",
                                  boxShadow: canAffordXP ? "0 8px 20px rgba(255,212,0,.2)" : "none",
                                }}>
                                {buying === p.id ? "…" : `${p.xp_price.toLocaleString()} XP`}
                              </button>
                            )}
                            {/* Fiat button */}
                            {p.fiat_price_cents !== null && (
                              <button
                                onClick={() => buyWithStripe(p)}
                                disabled={buying === p.id}
                                className="flex-1 rounded-[14px] py-2.5 font-black text-[13px] cursor-pointer border transition-all"
                                style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", color: "white" }}>
                                {buying === p.id ? "…" : formatPrice(p.fiat_price_cents)}
                              </button>
                            )}
                            {!p.xp_price && !p.fiat_price_cents && (
                              <span className="text-[12px] text-[#737D9D]">Solo Top 20</span>
                            )}
                          </div>
                          {p.xp_price !== null && !canAffordXP && (
                            <p className="text-[10px] text-[#737D9D] mt-1.5 mb-0 text-center">
                              Necesitas {(p.xp_price - xp).toLocaleString()} XP más · o paga {p.fiat_price_cents ? formatPrice(p.fiat_price_cents) : ""}
                            </p>
                          )}
                        </div>
                      )}
                      {bought && (
                        <div className="px-[14px] pb-3 text-center text-[12px] font-black" style={{ color: "#4DFF9D" }}>
                          ✓ Desbloqueado
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Other products */}
          {otherProducts.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,.08)" }} />
                <span className="text-[10px] font-black text-[#737D9D] uppercase tracking-wider">Más beneficios</span>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,.08)" }} />
              </div>
              <div className="grid gap-[10px]">
                {otherProducts.map(p => {
                  const bought = isPurchased(p.id);
                  const canAffordXP = p.xp_price !== null && xp >= p.xp_price;
                  const cc = categoryColors[p.category];
                  return (
                    <div key={p.id} className="rounded-[22px] border p-[14px]"
                      style={{ background: bought ? "rgba(77,255,157,.07)" : "rgba(23,29,52,.86)", border: bought ? "1px solid rgba(77,255,157,.25)" : "1px solid rgba(255,255,255,.09)" }}>
                      <div className="flex gap-3 items-center mb-3">
                        <div className="w-[40px] h-[40px] rounded-[13px] grid place-items-center text-[18px] flex-none" style={{ background: cc.bg }}>
                          {categoryIcons[p.category]}
                        </div>
                        <div className="flex-1">
                          <div className="font-black text-[13px] text-white">{p.name}</div>
                          <p className="m-0 text-[11px]" style={{ color: "#A9B1CB" }}>{p.description}</p>
                        </div>
                        {bought && <span className="text-[14px] text-[#4DFF9D]">✓</span>}
                      </div>
                      {!bought && (
                        <div className="flex gap-2">
                          {p.xp_price !== null && (
                            <button onClick={() => buyWithXP(p)} disabled={buying === p.id || !canAffordXP}
                              className="flex-1 rounded-[12px] py-2 font-black text-[12px] border-0 cursor-pointer"
                              style={{ background: canAffordXP ? "#FFD400" : "rgba(255,255,255,.07)", color: canAffordXP ? "#10131F" : "#737D9D" }}>
                              {p.xp_price.toLocaleString()} XP
                            </button>
                          )}
                          {p.fiat_price_cents !== null && (
                            <button onClick={() => buyWithStripe(p)} disabled={buying === p.id}
                              className="flex-1 rounded-[12px] py-2 font-black text-[12px] cursor-pointer border"
                              style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", color: "white" }}>
                              {formatPrice(p.fiat_price_cents)}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Earn XP hint */}
      <div className="mt-5 rounded-[18px] border p-4"
        style={{ background: "rgba(255,212,0,.06)", border: "1px solid rgba(255,212,0,.15)" }}>
        <div className="font-black text-[13px] text-[#FFD400] mb-1">💡 Cómo ganar XP gratis</div>
        <div className="text-[11px] leading-relaxed" style={{ color: "#A9B1CB" }}>
          Completa los pasos de tu Quest · Responde challenges · Invita actores al ecosistema · Completa tu perfil
        </div>
      </div>
    </div>
  );
}
