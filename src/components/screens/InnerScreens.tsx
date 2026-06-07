"use client";

import { useState, useEffect } from "react";
import { useNav, useDispatch } from "@/lib/store";
import { useDBUser } from "@/components/UserProvider";
import { upsertStartup, addUserXP, addUserBadge, requestMeeting, submitVote, fetchChallenges } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BackBar } from "@/components/BackBar";

/* ─── Shared form field ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <label className="block text-[var(--muted)] text-[12px] mt-3 mb-[7px]">{label}</label>
      {children}
    </>
  );
}

const inputCls =
  "w-full border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.06)] rounded-[14px] p-3 text-[var(--text)] outline-none font-sans";

/* ─── Role Matrix ─── */
export function RoleMatrix() {
  const { go } = useNav();
  const rows: { icon: string; role: string; tagline: string; perms: { label: string; status: string; color: string }[] }[] = [
    {
      icon: "🚀", role: "Startup", tagline: "Construye reputación y desbloquea acceso.",
      perms: [
        { label: "Completar perfil y propuesta", status: "Crear", color: "#4DFF9D" },
        { label: "Responder Brand Challenges", status: "Crear", color: "#4DFF9D" },
        { label: "Votar Awards", status: "Votar", color: "#FFD400" },
        { label: "Crear retos de marca", status: "No", color: "var(--soft)" },
      ],
    },
    {
      icon: "🔎", role: "Agencia", tagline: "Scouting y recomendaciones para clientes.",
      perms: [
        { label: "Guardar startups favoritas", status: "Crear", color: "#4DFF9D" },
        { label: "Recomendar finalistas", status: "Recomendar", color: "#4DFF9D" },
        { label: "Crear briefs para clientes", status: "Crear", color: "#4DFF9D" },
        { label: "Editar perfiles de startups", status: "No", color: "var(--soft)" },
      ],
    },
    {
      icon: "🎯", role: "Marca", tagline: "Publica retos y selecciona pilotos.",
      perms: [
        { label: "Publicar Brand Challenge", status: "Crear", color: "#4DFF9D" },
        { label: "Votar propuestas", status: "Votar", color: "#4DFF9D" },
        { label: "Solicitar reuniones", status: "Crear", color: "#4DFF9D" },
        { label: "Competir como startup", status: "No", color: "var(--soft)" },
      ],
    },
    {
      icon: "🌐", role: "Institucional", tagline: "Activa y mide la participación de su comunidad.",
      perms: [
        { label: "Invitar startups del ecosistema", status: "Crear", color: "#4DFF9D" },
        { label: "Ver ranking de su comunidad", status: "Ver", color: "#4DFF9D" },
        { label: "Recomendar startups", status: "Recomendar", color: "#4DFF9D" },
        { label: "Editar retos de marcas", status: "No", color: "var(--soft)" },
      ],
    },
  ];

  return (
    <div>
      <BackBar title="Permisos por rol" subtitle="Qué puede hacer cada actor dentro del ecosistema." />
      <div className="grid gap-[10px] mb-4">
        {rows.map((r) => (
          <details key={r.role} className="border border-[rgba(255,255,255,.09)] bg-[rgba(23,29,52,.86)] rounded-[22px] overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,.18)]">
            <summary className="list-none cursor-pointer p-[14px] flex gap-3 items-center">
              <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">{r.icon}</div>
              <div className="flex-1">
                <h4 className="m-0 mb-1 text-[14px] font-semibold">{r.role}</h4>
                <p className="m-0 text-[var(--muted)] text-[12px]">{r.tagline}</p>
              </div>
              <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[rgba(255,255,255,.07)] text-[#FFD400] font-black">⌄</div>
            </summary>
            <div className="p-[14px] border-t border-[rgba(255,255,255,.09)] grid gap-2">
              {r.perms.map((p) => (
                <div key={p.label} className="grid items-center border border-[rgba(255,255,255,.09)] rounded-[15px] p-[10px] bg-[rgba(255,255,255,.04)] text-[12px]" style={{ gridTemplateColumns: "1fr auto" }}>
                  <b className="text-[12px]">{p.label}</b>
                  <div style={{ color: p.color }} className="font-black">{p.status}</div>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
      <Button full onClick={() => go("onboarding")}>Elegir rol</Button>
    </div>
  );
}

/* ─── Quests (Startup) ─── */
export function Quests() {
  const { go } = useNav();
  const items = [
    { icon: "✅", title: "Perfil", desc: "Completa tu ficha Startup Ready para marcas y agencias.", xp: "+250 XP", screen: "profile-page" as const },
    { icon: "🧠", title: "Mapa de capacidades IA", desc: "Selecciona verticales: content, data, CX, automation, gamification.", xp: "+120 XP", screen: "capabilities-page" as const },
    { icon: "🎯", title: "Propuesta 30/60/90", desc: "Define un piloto realista para una gran marca.", xp: "+300 XP", screen: "pilot-page" as const },
    { icon: "📣", title: "Promoción", desc: "Invita actores clave y comparte el evento con trazabilidad.", xp: "+400 XP", screen: "promotion-page" as const },
    { icon: "🏆", title: "Responde un Brand Challenge", desc: "Participa en un reto publicado por sponsor, agencia o marca.", xp: "+500 XP", screen: "challenge-page" as const },
  ];

  return (
    <div>
      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Startup Quest</h3>
        <button onClick={() => go("access-flow")} className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0">Ruta de acceso</button>
      </div>
      <div className="grid gap-[10px]">
        {items.map((q) => (
          <Card key={q.title} clickable onClick={() => go(q.screen)} className="flex gap-3 items-center">
            <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">{q.icon}</div>
            <div className="flex-1">
              <h4 className="m-0 mb-1 text-[14px] font-semibold">{q.title}</h4>
              <p className="m-0 text-[var(--muted)] text-[12px]">{q.desc}</p>
            </div>
            <div className="text-[#FFD400] font-black text-[12px] whitespace-nowrap">{q.xp}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─── Access Flow ─── */
export function AccessFlow() {
  const { go } = useNav();
  const steps = [
    { n: 1, title: "500 XP · Candidatura activa", desc: "Registro completo." },
    { n: 2, title: "1,000 XP · Entrada gratuita", desc: "Perfil, pitch y propuesta." },
    { n: 3, title: "2,000 XP · Shortlist pitch", desc: "Challenge validado." },
    { n: 4, title: "Top 20 · Reuniones premium", desc: "Sponsor, marcas y agencias." },
  ];

  return (
    <div>
      <BackBar title="Ruta de acceso" subtitle="XP, beneficios y selección" />
      <div className="grid gap-[10px] mb-4">
        {steps.map((s) => (
          <Card key={s.n} className="flex gap-3 items-start">
            <div className="w-[30px] h-[30px] rounded-[12px] bg-[rgba(255,212,0,.16)] text-[#FFD400] grid place-items-center font-black flex-none">{s.n}</div>
            <div>
              <h4 className="m-0 text-[13px] font-semibold">{s.title}</h4>
              <p className="m-0 mt-1 text-[var(--muted)] text-[12px] leading-snug">{s.desc}</p>
            </div>
          </Card>
        ))}
      </div>
      <Button full onClick={() => go("profile-page")}>Empezar por perfil</Button>
      <Button full variant="secondary" onClick={() => go("quests")}>Ver todas las misiones</Button>
    </div>
  );
}

/* ─── Challenge Detail ─── */
export function ChallengeDetail() {
  const { go } = useNav();
  return (
    <div>
      <BackBar title="Personalización a escala" subtitle="Sponsor Challenge · 500 XP" />
      <Card className="mb-4 relative overflow-hidden">
        <span className="inline-flex rounded-full px-[9px] py-[6px] text-[10px] font-black mb-[10px] bg-[rgba(255,212,0,.16)] text-[#FFD400]">Brief principal</span>
        <h4 className="m-0 mb-1 text-[14px] font-semibold">Objetivo</h4>
        <p className="m-0 text-[var(--muted)] text-[13px] leading-relaxed">Encontrar startups capaces de generar, adaptar, publicar y medir contenido para diferentes segmentos sin perder consistencia de marca.</p>
        <div className="flex gap-2 flex-wrap mt-3">
          <Badge variant="gold">Content AI</Badge>
          <Badge>Retail</Badge>
          <Badge>Medición</Badge>
        </div>
      </Card>
      <div className="flex items-end justify-between mx-0.5 mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Entregables</h3>
      </div>
      <div className="grid gap-[10px] mb-4">
        {[
          { n: 1, title: "Diagnóstico", desc: "Qué problema resuelves y para qué tipo de marca." },
          { n: 2, title: "Piloto 30/60/90", desc: "Coste, tiempos, equipo necesario y KPIs de éxito." },
          { n: 3, title: "Demo o evidencia", desc: "Link, vídeo, caso de uso o prototipo funcional." },
        ].map((s) => (
          <Card key={s.n} className="flex gap-3 items-start">
            <div className="w-[30px] h-[30px] rounded-[12px] bg-[rgba(255,212,0,.16)] text-[#FFD400] grid place-items-center font-black flex-none">{s.n}</div>
            <div>
              <h4 className="m-0 text-[13px] font-semibold">{s.title}</h4>
              <p className="m-0 mt-1 text-[var(--muted)] text-[12px] leading-snug">{s.desc}</p>
            </div>
          </Card>
        ))}
      </div>
      <Button full onClick={() => go("challenge-response")}>Responder challenge</Button>
    </div>
  );
}

/* ─── Challenge Response ─── */
export function ChallengeResponse() {
  return (
    <div>
      <BackBar title="Respuesta al Challenge" subtitle="Completa la propuesta para ganar XP." />
      <Card>
        <Field label="Propuesta breve">
          <textarea className={`${inputCls} min-h-[82px] resize-y`} defaultValue="Nuestra solución personaliza creatividades, copies y flujos conversacionales por segmento, manteniendo brand voice y midiendo conversión." />
        </Field>
        <Field label="KPI principal">
          <select className={inputCls}>
            <option>Conversión</option>
            <option>Retención</option>
            <option>Coste de producción</option>
            <option>NPS</option>
          </select>
        </Field>
        <Field label="Link demo">
          <input type="url" className={inputCls} placeholder="https://" />
        </Field>
        <Button full>Enviar y ganar +500 XP</Button>
      </Card>
    </div>
  );
}

/* ─── Challenge Create ─── */
export function ChallengeCreate() {
  return (
    <div>
      <BackBar title="Publicar un reto" subtitle="Para marcas, agencias y sponsor." />
      <Card>
        <Field label="Tipo de reto">
          <select className={inputCls}><option>Brand Challenge</option><option>Agency Brief</option><option>Sponsor Challenge</option></select>
        </Field>
        <Field label="Título"><input className={inputCls} placeholder="Ej: IA para mejorar fidelización" /></Field>
        <Field label="Descripción"><textarea className={`${inputCls} min-h-[82px] resize-y`} /></Field>
        <Field label="Vertical">
          <select className={inputCls}><option>Content AI</option><option>Customer Experience</option><option>Loyalty</option></select>
        </Field>
        <Button full>Publicar reto</Button>
      </Card>
    </div>
  );
}

/* ─── Startup Detail ─── */
export function StartupDetail() {
  const { go } = useNav();
  return (
    <div>
      <BackBar title="CXFlow AI" subtitle="Startup profile · Match 94%" />
      <Card className="flex gap-3 items-center mb-4">
        <div className="w-[58px] h-[58px] rounded-[22px] grid place-items-center font-black text-[20px] flex-none" style={{ background: "linear-gradient(135deg,#44D7FF,#FF4FD8)" }}>CX</div>
        <div>
          <h4 className="m-0 font-semibold">AI agents para atención y ventas</h4>
          <p className="m-0 mt-1 text-[var(--muted)] text-[12px]">Pilotos conversacionales para retail, banca y servicios.</p>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge variant="gold">Customer Experience</Badge>
            <Badge variant="green">Piloto 30 días</Badge>
          </div>
        </div>
      </Card>
      <div className="flex items-end justify-between mx-0.5 mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Datos comerciales</h3>
      </div>
      <Card className="mb-4">
        {[
          { label: "Madurez", value: "MVP con clientes" },
          { label: "Busca", value: "Pilotos con marcas" },
          { label: "Ticket piloto", value: "€8k - €20k" },
          { label: "Equipo", value: "5 personas" },
        ].map((r, i, arr) => (
          <div key={r.label} className={`grid gap-2 py-[10px] text-[12px] ${i < arr.length - 1 ? "border-b border-[rgba(255,255,255,.09)]" : ""}`} style={{ gridTemplateColumns: "1fr auto" }}>
            <span className="text-[var(--muted)]">{r.label}</span>
            <b>{r.value}</b>
          </div>
        ))}
      </Card>
      <div className="flex gap-2">
        <button className="flex-1 border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.07)] text-[var(--text)] rounded-[14px] py-[10px] text-[12px] font-black cursor-pointer">Guardar</button>
        <button onClick={() => go("meeting-page")} className="flex-1 bg-[#FFD400] text-[#10131F] border-transparent rounded-[14px] py-[10px] text-[12px] font-black cursor-pointer">Solicitar reunión</button>
      </div>
    </div>
  );
}

/* ─── Meeting Page ─── */
export function MeetingPage() {
  const dbUser = useDBUser();
  const [objective, setObjective] = useState("Explorar piloto");
  const [message, setMessage] = useState("Nos interesa conocer vuestra solución para un cliente retail con necesidades de atención y venta asistida.");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (dbUser?.id) {
      await requestMeeting({ requester_id: dbUser.id, objective, message });
    }
    setSent(true);
  }

  return (
    <div>
      <BackBar title="Solicitar reunión" subtitle="Conecta startup, agencia y marca." />
      <Card>
        <form onSubmit={handleSubmit}>
          <Field label="Objetivo de la reunión">
            <select className={inputCls} value={objective} onChange={e => setObjective(e.target.value)}>
              <option>Explorar piloto</option>
              <option>Demo producto</option>
              <option>Presentar a cliente</option>
            </select>
          </Field>
          <Field label="Mensaje">
            <textarea className={`${inputCls} min-h-[82px] resize-y`} value={message} onChange={e => setMessage(e.target.value)} />
          </Field>
          <button type="submit" disabled={sent} className="w-full mt-3 rounded-[16px] py-3 font-black text-[14px] border-0 cursor-pointer transition-all"
            style={{ background: sent ? "rgba(77,255,157,.2)" : "#FFD400", color: sent ? "#4DFF9D" : "#10131F", boxShadow: sent ? "none" : "0 10px 25px rgba(255,212,0,.22)" }}>
            {sent ? "✓ Reunión solicitada" : "Solicitar reunión"}
          </button>
        </form>
      </Card>
    </div>
  );
}

/* ─── Event Page ─── */
export function EventPage() {
  const { go } = useNav();
  return (
    <div>
      <BackBar title="AI4Brands 2026" subtitle="Evento creado por Yellow" />
      <div className="rounded-[28px] border p-5 mb-4 relative overflow-hidden" style={{ background: "linear-gradient(145deg,rgba(255,212,0,.14),rgba(68,215,255,.08) 45%,rgba(255,79,216,.09))", border: "1px solid rgba(255,255,255,.09)", boxShadow: "0 18px 60px rgba(0,0,0,.35)" }}>
        <small className="text-[#FFD400] font-black uppercase tracking-widest text-[11px]">Innovation League</small>
        <h2 className="text-[27px] font-black tracking-tight leading-none mt-2 mb-2">IA aplicada a marcas.</h2>
        <p className="m-0 text-[#DCE3FF] text-[13px] leading-relaxed">Un evento creado por Yellow para conectar startups de IA, agencias de marketing y grandes marcas.</p>
        <div className="flex gap-2 flex-wrap mt-3">
          {["🎟️ Startup Quest", "🌐 Ecosystem Challenge", "🎯 Brand Challenges"].map(p => (
            <span key={p} className="border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.07)] rounded-full px-[10px] py-[8px] text-[11px] font-black text-[#EAF0FF]">{p}</span>
          ))}
        </div>
      </div>
      <div className="flex items-end justify-between mx-0.5 mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Participantes</h3>
      </div>
      <div className="grid gap-[10px] mb-4">
        {[
          { icon: "🚀", title: "Startups", desc: "Presentan soluciones y pilotos." },
          { icon: "🏢", title: "Agencias", desc: "Actúan como scouts para sus clientes." },
          { icon: "🎯", title: "Marcas", desc: "Publican retos y seleccionan propuestas." },
          { icon: "🌐", title: "Ecosistemas", desc: "Movilizan a sus comunidades." },
        ].map(p => (
          <Card key={p.title} className="flex gap-3 items-center">
            <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">{p.icon}</div>
            <div><h4 className="m-0 mb-1 text-[14px] font-semibold">{p.title}</h4><p className="m-0 text-[var(--muted)] text-[12px]">{p.desc}</p></div>
          </Card>
        ))}
      </div>
      <Button full onClick={() => go("ecosystem-challenge")}>Ver reto colectivo</Button>
      <Button full variant="secondary" onClick={() => go("access-flow")}>Ver acceso</Button>
    </div>
  );
}

/* ─── Ecosystem Challenge ─── */
export function EcosystemChallenge() {
  const { go } = useNav();
  return (
    <div>
      <BackBar title="Ecosystem Challenge" subtitle="Reto colectivo" />
      <div className="rounded-[28px] border p-5 mb-4 relative overflow-hidden" style={{ background: "linear-gradient(145deg,rgba(255,212,0,.14),rgba(68,215,255,.08) 45%,rgba(255,79,216,.09))", border: "1px solid rgba(255,255,255,.09)" }}>
        <small className="text-[#FFD400] font-black uppercase tracking-widest text-[11px]">Antes del evento</small>
        <h2 className="text-[22px] font-black tracking-tight leading-tight mt-2 mb-2">Gana quien más oportunidades genere.</h2>
        <p className="m-0 text-[#DCE3FF] text-[13px] leading-relaxed">El reto mide acciones verificadas, no asistencia: perfiles, briefs, votos, propuestas y reuniones.</p>
      </div>
      <div className="flex items-end justify-between mx-0.5 mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Cómo se gana XP</h3>
      </div>
      <div className="grid gap-[10px] mb-4">
        {[
          { icon: "🚀", role: "Startup", desc: "Perfil + pitch + piloto.", xp: "+1,000 XP" },
          { icon: "🏢", role: "Agencia", desc: "Votos, favoritos y briefs.", xp: "+800 XP" },
          { icon: "🎯", role: "Marca", desc: "Challenge + reuniones.", xp: "+1,200 XP" },
          { icon: "🌐", role: "Ecosistema", desc: "Invitaciones validadas.", xp: "+2,000 XP" },
        ].map(r => (
          <Card key={r.role} className="flex gap-3 items-center">
            <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">{r.icon}</div>
            <div className="flex-1"><h4 className="m-0 mb-1 text-[14px] font-semibold">{r.role}</h4><p className="m-0 text-[var(--muted)] text-[12px]">{r.desc}</p></div>
            <div className="text-[#FFD400] font-black text-[12px] whitespace-nowrap">{r.xp}</div>
          </Card>
        ))}
      </div>
      <Button full onClick={() => go("rankings")}>Ver ranking</Button>
    </div>
  );
}

/* ─── Founder Challenge ─── */
export function FounderChallenge() {
  const { go } = useNav();
  return (
    <div>
      <BackBar title="Mensaje de Elena Bienes" subtitle="Founder & CEO de Yellow" />
      <Card className="flex gap-3 items-center mb-4">
        <div className="w-[58px] h-[58px] rounded-[22px] grid place-items-center font-black text-[20px] flex-none" style={{ background: "linear-gradient(135deg,#44D7FF,#FF4FD8)" }}>EB</div>
        <div>
          <h4 className="m-0 font-semibold">"No vengas solo a escuchar. Ven a activar."</h4>
          <p className="m-0 mt-2 text-[var(--muted)] text-[12px] leading-snug">AI4Brands nace para que startups, agencias y marcas lleguen al evento con conversaciones útiles ya iniciadas.</p>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge variant="gold">Yellow</Badge>
            <Badge>Startups Españolas</Badge>
          </div>
        </div>
      </Card>
      <div className="flex items-end justify-between mx-0.5 mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Reto personal</h3>
      </div>
      <Card className="mb-4 relative overflow-hidden">
        <span className="inline-flex rounded-full px-[9px] py-[6px] text-[10px] font-black mb-[10px] bg-[rgba(255,79,216,.14)] text-[#FF4FD8]">Founder Challenge</span>
        <h4 className="m-0 mb-1 text-[14px] font-semibold">Trae una oportunidad real</h4>
        <p className="m-0 text-[var(--muted)] text-[12px] leading-snug">Invita a una startup, agencia o marca y conecta su necesidad con una solución de IA aplicable a marketing, ventas, contenido o experiencia de cliente.</p>
        <div className="flex gap-2 flex-wrap mt-3">
          <Badge variant="gold">+400 XP</Badge>
          <Badge variant="green">Acceso prioritario</Badge>
        </div>
      </Card>
      <Button full onClick={() => go("invite-page")}>Aceptar reto</Button>
    </div>
  );
}

/* ─── Invite Page ─── */
export function InvitePage() {
  return (
    <div>
      <BackBar title="Invita una agencia" subtitle="Trae scouts para multiplicar oportunidades." />
      <Card>
        <Field label="Email del scout"><input type="email" className={inputCls} placeholder="nombre@agencia.com" /></Field>
        <Field label="Mensaje sugerido">
          <textarea className={`${inputCls} min-h-[82px] resize-y`} defaultValue="Te invito a descubrir startups de IA listas para pilotos con marcas." />
        </Field>
        <Button full>Enviar invitación +200 XP</Button>
      </Card>
    </div>
  );
}

/* ─── Profile Page ─── */
export function ProfilePage() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const dbUser = useDBUser();

  const [name, setName] = useState("");
  const [vertical, setVertical] = useState("Content AI");
  const [pitch, setPitch] = useState("");
  const [client, setClient] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !pitch.trim()) return;

    // Persist to Supabase
    if (dbUser?.id) {
      await upsertStartup(dbUser.id, {
        name: name.trim(),
        vertical,
        one_liner: pitch.trim(),
        ideal_client: client.trim(),
      });
      await addUserXP(dbUser.id, 220);
      await addUserBadge(dbUser.id, "Perfil Iniciado");
    }

    dispatch({ type: "ADD_XP", amount: 220 });
    dispatch({ type: "ADD_BADGE", badge: "Perfil Iniciado" });
    setSaved(true);
    setTimeout(() => go("promotion-page"), 900);
  }

  return (
    <div>
      <BackBar title="Perfil" subtitle="Startup Ready" />
      <div className="rounded-[24px] border p-4 mb-4" style={{ background: "linear-gradient(145deg,rgba(255,212,0,.14),rgba(68,215,255,.08) 45%,rgba(255,79,216,.09))", border: "1px solid rgba(255,255,255,.09)" }}>
        <small className="text-[#FFD400] font-black uppercase tracking-widest text-[11px]">Paso 1</small>
        <h2 className="text-[22px] font-black tracking-tight leading-tight mt-2 mb-2">Haz clara tu oportunidad.</h2>
        <p className="m-0 text-[#DCE3FF] text-[13px] leading-relaxed">Completa solo lo necesario para que agencias y marcas entiendan tu piloto.</p>
      </div>

      <details className="border border-[rgba(255,255,255,.09)] bg-[rgba(23,29,52,.86)] rounded-[22px] overflow-hidden mb-[10px]" open>
        <summary className="list-none cursor-pointer p-[14px] flex gap-3 items-center">
          <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">🧾</div>
          <div className="flex-1">
            <h4 className="m-0 mb-1 text-[14px] font-semibold">Ficha básica</h4>
            <p className="m-0 text-[var(--muted)] text-[12px]">Nombre, vertical, pitch y cliente ideal.</p>
          </div>
          <div className="text-[#FFD400] font-black text-[12px] ml-auto">+220 XP</div>
          <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[rgba(255,255,255,.07)] text-[#FFD400] font-black ml-2">⌄</div>
        </summary>

        <form onSubmit={handleSave} className="p-[14px] border-t border-[rgba(255,255,255,.09)]">
          <Field label="Nombre de la startup *">
            <input
              required
              className={inputCls}
              placeholder="Ej: CXFlow AI"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Vertical principal">
            <select className={inputCls} value={vertical} onChange={(e) => setVertical(e.target.value)}>
              <option>Content AI</option>
              <option>Customer Experience</option>
              <option>Data & Insights</option>
              <option>Loyalty & Gamification</option>
              <option>Automation</option>
            </select>
          </Field>
          <Field label="Pitch en una frase *">
            <textarea
              required
              className={`${inputCls} min-h-[60px] resize-y`}
              placeholder="Ayudamos a marcas a... con IA..."
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
            />
          </Field>
          <Field label="Cliente ideal">
            <input
              className={inputCls}
              placeholder="Ej: retail, banca, turismo, gran consumo"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </Field>

          <button
            type="submit"
            disabled={saved}
            className="w-full mt-3 rounded-[16px] py-3 font-black text-[14px] border-0 cursor-pointer transition-all"
            style={{
              background: saved ? "rgba(77,255,157,.2)" : "#FFD400",
              color: saved ? "#4DFF9D" : "#10131F",
              boxShadow: saved ? "none" : "0 10px 25px rgba(255,212,0,.22)",
            }}
          >
            {saved ? "✓ Perfil guardado · +220 XP" : "Guardar perfil"}
          </button>
        </form>
      </details>

      <Button full variant="secondary" onClick={() => go("promotion-page")}>
        Siguiente: Promoción
      </Button>
    </div>
  );
}

/* ─── Badges Page ─── */
export function BadgesPage() {
  const { go } = useNav();
  const groups = [
    { icon: "🚀", title: "Badges Startup", tagline: "Para equipos que quieren ganarse acceso y visibilidad.",
      items: [
        { title: "Candidato", sub: "Registro validado en la base de datos", icon: "✅" },
        { title: "Startup Listo", sub: "Perfil, pitch y capacidades IA completas", icon: "🏅" },
        { title: "Constructor de Retos", sub: "Propuesta 30/60/90 enviada", icon: "🎯" },
        { title: "Finalista", sub: "Shortlist por votos, recomendaciones o jurado", icon: "🏆" },
        { title: "Listo para Piloto", sub: "Reunión solicitada por agencia o marca", icon: "🤝" },
      ]},
    { icon: "🔎", title: "Badges Agencia", tagline: "Para agencias que descubren soluciones para clientes.",
      items: [
        { title: "Scout de Agencia", sub: "Perfil de agencia validado", icon: "🔎" },
        { title: "Recomendador", sub: "Recomienda startups con justificación", icon: "⭐" },
        { title: "Creador de Briefs", sub: "Publica retos o necesidades de cliente", icon: "🧾" },
        { title: "Conector Top", sub: "Genera reuniones calificadas", icon: "🤝" },
      ]},
    { icon: "🎯", title: "Badges Marca", tagline: "Para marcas que lanzan retos y buscan pilotos.",
      items: [
        { title: "Explorador de Marca", sub: "Marca registrada y validada", icon: "👀" },
        { title: "Dueño del Reto", sub: "Publica un reto de innovación", icon: "🎯" },
        { title: "Comprador de Innovación", sub: "Solicita reuniones con startups", icon: "🛒" },
        { title: "Patrocinador de Piloto", sub: "Activa un piloto o selección formal", icon: "🚀" },
      ]},
    { icon: "🌐", title: "Badges Ecosistema", tagline: "Para hubs, aceleradoras, universidades y comunidades.",
      items: [
        { title: "Socio Comunitario", sub: "Ecosistema verificado", icon: "🌐" },
        { title: "Activador de Talento", sub: "Invita startups que completan perfil", icon: "📣" },
        { title: "Aliado de Retos", sub: "Promueve retos y genera propuestas", icon: "🎯" },
        { title: "Campeón del Ecosistema", sub: "Top ranking por actividad útil", icon: "🏆" },
      ]},
  ];

  return (
    <div>
      <BackBar title="Badge System" subtitle="Roles, reputación y base de datos" />
      <div className="grid gap-[10px]">
        {groups.map((g) => (
          <details key={g.title} className="border border-[rgba(255,255,255,.09)] bg-[rgba(23,29,52,.86)] rounded-[22px] overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,.18)]">
            <summary className="list-none cursor-pointer p-[14px] flex gap-3 items-center">
              <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">{g.icon}</div>
              <div className="flex-1"><h4 className="m-0 mb-1 text-[14px] font-semibold">{g.title}</h4><p className="m-0 text-[var(--muted)] text-[12px]">{g.tagline}</p></div>
              <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[rgba(255,255,255,.07)] text-[#FFD400] font-black">⌄</div>
            </summary>
            <div className="p-[14px] border-t border-[rgba(255,255,255,.09)] grid gap-[9px]">
              {g.items.map((item) => (
                <div key={item.title} className="flex items-center justify-between border border-[rgba(255,255,255,.09)] rounded-[17px] p-3 bg-[rgba(255,255,255,.04)]">
                  <div><div className="text-[13px] font-black">{item.title}</div><span className="text-[11px] text-[var(--muted)]">{item.sub}</span></div>
                  <span className="text-[18px]">{item.icon}</span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

/* ─── Community Page ─── */
export function CommunityPage() {
  return (
    <div>
      <BackBar title="Telegram Community" subtitle="Canal, grupo y roles" />
      <div className="rounded-[24px] border p-4 mb-4" style={{ background: "linear-gradient(145deg,rgba(255,212,0,.14),rgba(68,215,255,.08) 45%,rgba(255,79,216,.09))", border: "1px solid rgba(255,255,255,.09)" }}>
        <small className="text-[#FFD400] font-black uppercase tracking-widest text-[11px]">Community Layer</small>
        <h2 className="text-[22px] font-black tracking-tight leading-tight mt-2 mb-2">La MiniApp vive dentro de Telegram.</h2>
        <p className="m-0 text-[#DCE3FF] text-[13px] leading-relaxed">El canal concentra anuncios oficiales. El grupo activa networking, retos, soporte y conversaciones entre perfiles validados.</p>
      </div>
      <div className="grid gap-[10px]">
        <details className="border border-[rgba(255,255,255,.09)] bg-[rgba(23,29,52,.86)] rounded-[22px] overflow-hidden" open>
          <summary className="list-none cursor-pointer p-[14px] flex gap-3 items-center">
            <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">📢</div>
            <div className="flex-1"><h4 className="m-0 mb-1 text-[14px] font-semibold">Canal oficial</h4><p className="m-0 text-[var(--muted)] text-[12px]">Anuncios, deadlines, finalistas, awards y contenido de Yellow.</p></div>
            <div className="text-[#FFD400] font-black text-[12px] ml-auto">+50 XP</div>
            <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[rgba(255,255,255,.07)] text-[#FFD400] font-black ml-2">⌄</div>
          </summary>
          <div className="p-[14px] border-t border-[rgba(255,255,255,.09)]">
            <Button full>Unirme al canal</Button>
          </div>
        </details>
        <details className="border border-[rgba(255,255,255,.09)] bg-[rgba(23,29,52,.86)] rounded-[22px] overflow-hidden">
          <summary className="list-none cursor-pointer p-[14px] flex gap-3 items-center">
            <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">💬</div>
            <div className="flex-1"><h4 className="m-0 mb-1 text-[14px] font-semibold">Grupo de networking</h4><p className="m-0 text-[var(--muted)] text-[12px]">Conversación entre startups, agencias, marcas y ecosistemas.</p></div>
            <div className="text-[#FFD400] font-black text-[12px] ml-auto">+100 XP</div>
            <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[rgba(255,255,255,.07)] text-[#FFD400] font-black ml-2">⌄</div>
          </summary>
          <div className="p-[14px] border-t border-[rgba(255,255,255,.09)]">
            <Button full>Unirme al grupo</Button>
          </div>
        </details>
      </div>
    </div>
  );
}

/* ─── Agency Dashboard ─── */
export function AgencyDashboard() {
  const { go } = useNav();
  return (
    <div>
      <BackBar title="Panel de agencia" subtitle="Gestiona scouts, favoritos y briefs." />
      <div className="grid gap-[10px] mb-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {[
          { value: "18", label: "startups guardadas" },
          { value: "6", label: "reuniones pedidas" },
          { value: "3", label: "briefs activos" },
          { value: "420", label: "Agency XP" },
        ].map(k => (
          <div key={k.label} className="p-3 rounded-[18px] bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)]">
            <b className="text-[20px] block">{k.value}</b>
            <span className="text-[var(--muted)] text-[11px] mt-1 block">{k.label}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-[10px]">
        <Card clickable onClick={() => go("challenge-create")} className="flex gap-3 items-center">
          <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">📝</div>
          <div><h4 className="m-0 mb-1 text-[14px] font-semibold">Crear brief para cliente</h4><p className="m-0 text-[var(--muted)] text-[12px]">Publica una necesidad para que las startups respondan.</p></div>
        </Card>
        <Card clickable onClick={() => go("startup-match")} className="flex gap-3 items-center">
          <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">🔎</div>
          <div><h4 className="m-0 mb-1 text-[14px] font-semibold">Ver matches</h4><p className="m-0 text-[var(--muted)] text-[12px]">Revisa recomendaciones según vertical y necesidad.</p></div>
        </Card>
      </div>
    </div>
  );
}

/* ─── Awards Vote ─── */
export function AwardsVote() {
  const dbUser = useDBUser();
  const [category, setCategory] = useState("Best Content AI Pilot");
  const [finalist, setFinalist] = useState("UGC Forge");
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);

  async function handleVote(e: React.FormEvent) {
    e.preventDefault();
    if (dbUser?.id) {
      await submitVote({ voter_id: dbUser.id, category, reason });
    }
    setSent(true);
  }

  return (
    <div>
      <BackBar title="Votar Awards" subtitle="Un voto por categoría" />
      <Card>
        <form onSubmit={handleVote}>
          <Field label="Categoría">
            <select className={inputCls} value={category} onChange={e => setCategory(e.target.value)}>
              <option>Best Content AI Pilot</option>
              <option>Best Customer Experience AI</option>
              <option>Best Data & Insights Solution</option>
              <option>Best Loyalty & Gamification AI</option>
              <option>Ecosystem Activation Award</option>
            </select>
          </Field>
          <Field label="Finalista">
            <select className={inputCls} value={finalist} onChange={e => setFinalist(e.target.value)}>
              <option>UGC Forge</option><option>CXFlow AI</option><option>RetailBot Lab</option><option>AdCopy OS</option>
            </select>
          </Field>
          <Field label="Motivo del voto">
            <textarea className={`${inputCls} min-h-[82px] resize-y`} placeholder="¿Por qué debería ganar?" value={reason} onChange={e => setReason(e.target.value)} />
          </Field>
          <button type="submit" disabled={sent} className="w-full mt-3 rounded-[16px] py-3 font-black text-[14px] border-0 cursor-pointer transition-all"
            style={{ background: sent ? "rgba(77,255,157,.2)" : "#FFD400", color: sent ? "#4DFF9D" : "#10131F", boxShadow: sent ? "none" : "0 10px 25px rgba(255,212,0,.22)" }}>
            {sent ? "✓ Voto registrado" : "Enviar voto"}
          </button>
        </form>
      </Card>
      <p className="text-center text-[var(--soft)] text-[11px] my-[18px]">Los votos públicos suman al ranking; el jurado valida elegibilidad y selecciona ganadores.</p>
    </div>
  );
}

/* ─── Awards Recommend ─── */
export function AwardsRecommend() {
  return (
    <div>
      <BackBar title="Recomendar startup" subtitle="Para agencias, marcas y ecosistemas" />
      <Card className="mb-4">
        <Field label="Startup recomendada"><input className={inputCls} placeholder="Nombre de la startup" /></Field>
        <Field label="Quién recomienda">
          <select className={inputCls}><option>Agencia</option><option>Marca</option><option>Ecosistema</option><option>Sponsor</option></select>
        </Field>
        <Field label="Encaje con reto">
          <select className={inputCls}><option>Content AI</option><option>Customer Experience</option><option>Data & Insights</option><option>Loyalty & Gamification</option><option>Automation</option></select>
        </Field>
        <Field label="Justificación">
          <textarea className={`${inputCls} min-h-[82px] resize-y`} placeholder="Describe el potencial de piloto o colaboración." />
        </Field>
        <Button full>Enviar recomendación</Button>
      </Card>
      <Card>
        <h4 className="m-0 mb-2 text-[14px] font-semibold">Cómo pesa la recomendación</h4>
        {[
          { label: "Agencia o marca validada", value: "+150 XP" },
          { label: "Recomendación con brief real", value: "+300 XP" },
          { label: "Reunión solicitada", value: "+500 XP" },
        ].map((r, i, arr) => (
          <div key={r.label} className={`grid gap-2 py-[10px] text-[12px] ${i < arr.length - 1 ? "border-b border-[rgba(255,255,255,.09)]" : ""}`} style={{ gridTemplateColumns: "1fr auto" }}>
            <span className="text-[var(--muted)]">{r.label}</span>
            <b>{r.value}</b>
          </div>
        ))}
      </Card>
    </div>
  );
}
