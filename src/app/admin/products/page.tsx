export const dynamic = "force-dynamic";

import { createServiceClient } from "@/lib/supabase/service";
import { SectionHeader, AdminCard, Table, Tr, Td, StatusPill } from "@/components/admin/AdminCard";
import { revalidatePath } from "next/cache";

async function upsertProduct(formData: FormData) {
  "use server";
  const supabase = createServiceClient();
  const id = formData.get("id") as string;
  const payload = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    xp_price: formData.get("xp_price") ? parseInt(formData.get("xp_price") as string) : null,
    fiat_price_cents: formData.get("fiat_price_cents") ? parseInt(formData.get("fiat_price_cents") as string) : null,
    stripe_price_id: (formData.get("stripe_price_id") as string) || null,
    badge_unlocked: (formData.get("badge_unlocked") as string) || null,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    active: formData.get("active") === "true",
  };
  if (id) {
    await supabase.from("products").update(payload).eq("id", id);
  } else {
    await supabase.from("products").insert([payload]);
  }
  revalidatePath("/admin/products");
}

async function deleteProduct(formData: FormData) {
  "use server";
  const supabase = createServiceClient();
  await supabase.from("products").delete().eq("id", formData.get("id") as string);
  revalidatePath("/admin/products");
}

const inputCls = "w-full rounded-[10px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2 text-[12px] text-white outline-none font-sans";
const labelCls = "block text-[10px] font-bold text-[#737D9D] uppercase tracking-wider mb-1";
const CATEGORIES = ["access", "visibility", "badge", "premium"];
const CATEGORY_COLORS: Record<string, string> = { access: "#FFD400", visibility: "#44D7FF", badge: "#4DFF9D", premium: "#FF4FD8" };

function ProductForm({ product }: { product?: any }) {
  const isEdit = !!product;
  return (
    <form action={upsertProduct} className="grid gap-3">
      {isEdit && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <label className={labelCls}>Nombre *</label>
          <input name="name" required defaultValue={product?.name ?? ""} className={inputCls} placeholder="Ej: Entrada Gratuita" />
        </div>
        <div>
          <label className={labelCls}>Categoría</label>
          <select name="category" defaultValue={product?.category ?? "access"} className={inputCls}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Descripción</label>
        <textarea name="description" rows={2} defaultValue={product?.description ?? ""} className={`${inputCls} resize-y`} />
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div>
          <label className={labelCls}>Precio XP (null = N/A)</label>
          <input type="number" name="xp_price" defaultValue={product?.xp_price ?? ""} min={0} className={inputCls} placeholder="1000" />
        </div>
        <div>
          <label className={labelCls}>Precio fiat (cents)</label>
          <input type="number" name="fiat_price_cents" defaultValue={product?.fiat_price_cents ?? ""} min={0} className={inputCls} placeholder="14900" />
        </div>
        <div>
          <label className={labelCls}>Orden</label>
          <input type="number" name="sort_order" defaultValue={product?.sort_order ?? 0} className={inputCls} />
        </div>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <label className={labelCls}>Stripe Price ID</label>
          <input name="stripe_price_id" defaultValue={product?.stripe_price_id ?? ""} className={inputCls} placeholder="price_xxx" />
        </div>
        <div>
          <label className={labelCls}>Badge desbloqueado</label>
          <input name="badge_unlocked" defaultValue={product?.badge_unlocked ?? ""} className={inputCls} placeholder="Candidato" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className={labelCls + " mb-0"}>Activo</label>
        <select name="active" defaultValue={String(product?.active ?? true)} className="rounded-[10px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2 text-[12px] text-white outline-none">
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>
      <button type="submit"
        className="rounded-[12px] px-4 py-2.5 text-[12px] font-black cursor-pointer border-0 mt-1"
        style={{ background: isEdit ? "#44D7FF" : "#4DFF9D", color: "#0A1A0F" }}>
        {isEdit ? "Guardar cambios" : "Crear producto"}
      </button>
    </form>
  );
}

export default async function ProductsPage() {
  const supabase = createServiceClient();
  const { data: products } = await supabase.from("products").select("*, purchases(id, status)").order("sort_order");
  const { data: purchases } = await supabase.from("purchases").select("id, status").eq("status", "completed");

  const list = products ?? [];

  return (
    <div>
      <SectionHeader title="🛍️ Productos" subtitle={`${list.length} productos · ${purchases?.length ?? 0} compras completadas`} />

      {/* Create new product */}
      <details className="mb-6 rounded-[18px] border overflow-hidden" style={{ border: "1px solid rgba(77,255,157,.3)", background: "rgba(23,29,52,.85)" }}>
        <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[18px]">➕</span>
            <span className="text-[14px] font-black text-white">Nuevo producto</span>
          </div>
          <span className="text-[11px] font-bold rounded-full px-3 py-1" style={{ background: "rgba(77,255,157,.15)", color: "#4DFF9D" }}>Crear</span>
        </summary>
        <div className="px-5 pb-5 pt-1 border-t border-[rgba(255,255,255,.08)]">
          <ProductForm />
        </div>
      </details>

      {/* Product list */}
      <div className="grid gap-3">
        {list.map((p: any) => {
          const completedPurchases = (p.purchases ?? []).filter((pu: any) => pu.status === "completed").length;
          const color = CATEGORY_COLORS[p.category] ?? "#737D9D";
          return (
            <details key={p.id} className="rounded-[18px] border overflow-hidden"
              style={{ background: "rgba(23,29,52,.85)", border: `1px solid ${p.active ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.04)"}`, opacity: p.active ? 1 : 0.6 }}>
              <summary className="list-none cursor-pointer px-5 py-4 flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-[13px] grid place-items-center text-[18px] flex-none" style={{ background: `${color}18` }}>
                  {p.category === "access" ? "🎫" : p.category === "visibility" ? "📣" : p.category === "badge" ? "🏅" : "⭐"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-[14px] text-white truncate">{p.name}</div>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>{p.category}</span>
                    {p.xp_price && <span className="text-[10px] text-[#FFD400]">{p.xp_price.toLocaleString()} XP</span>}
                    {p.fiat_price_cents && <span className="text-[10px] text-white">€{(p.fiat_price_cents / 100).toFixed(0)}</span>}
                    {completedPurchases > 0 && <span className="text-[10px] text-[#4DFF9D]">{completedPurchases} compras</span>}
                    {!p.active && <span className="text-[10px] text-[#737D9D]">Inactivo</span>}
                  </div>
                </div>
                <span className="text-[11px] text-[#737D9D]">Editar ⌄</span>
              </summary>
              <div className="px-5 pb-5 pt-2 border-t border-[rgba(255,255,255,.08)]">
                <ProductForm product={p} />
                <form action={deleteProduct} className="mt-3 pt-3 border-t border-[rgba(255,255,255,.06)] flex justify-end">
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit"
                    className="rounded-[10px] px-3 py-1.5 text-[11px] font-black cursor-pointer border border-[rgba(255,92,122,.3)] bg-[rgba(255,92,122,.08)] text-[#FF5C7A]"
                    onClick={e => { if (!confirm("¿Eliminar este producto?")) e.preventDefault(); }}>
                    Eliminar
                  </button>
                </form>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
