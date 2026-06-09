"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "@/lib/store";
import { useDBUser } from "@/components/UserProvider";
import { createClient } from "@/lib/supabase/client";
import { BackBar } from "@/components/BackBar";

/* ─── Types & config ─────────────────────────────────────────────── */

interface SocialAction {
  id: string;
  platform: "linkedin" | "instagram" | "youtube";
  action_type: string;
  label: string;
  desc: string;
  xp: number;
  urlHint: string;
  validate: (url: string) => boolean;
}

const ACTIONS: SocialAction[] = [
  // LinkedIn
  {
    id: "linkedin-post",
    platform: "linkedin",
    action_type: "post",
    label: "Post sobre AI4Brands",
    desc: "Publica un post en LinkedIn mencionando AI4Brands, IA o el evento.",
    xp: 150,
    urlHint: "https://www.linkedin.com/posts/…",
    validate: (u) => u.includes("linkedin.com"),
  },
  {
    id: "linkedin-comment",
    platform: "linkedin",
    action_type: "comment",
    label: "Comenta en un post oficial",
    desc: "Comenta en uno de los posts de AI4Brands o Yellow en LinkedIn.",
    xp: 75,
    urlHint: "https://www.linkedin.com/posts/…",
    validate: (u) => u.includes("linkedin.com"),
  },
  {
    id: "linkedin-share",
    platform: "linkedin",
    action_type: "share",
    label: "Comparte un artículo",
    desc: "Comparte un artículo o noticia sobre IA en marketing en LinkedIn.",
    xp: 100,
    urlHint: "https://www.linkedin.com/posts/…",
    validate: (u) => u.includes("linkedin.com"),
  },
  // Instagram
  {
    id: "instagram-post",
    platform: "instagram",
    action_type: "post",
    label: "Post / Reel en Instagram",
    desc: "Publica sobre AI4Brands o IA en marketing. Usa #AI4Brands en el caption.",
    xp: 200,
    urlHint: "https://www.instagram.com/p/…",
    validate: (u) => u.includes("instagram.com"),
  },
  {
    id: "instagram-story",
    platform: "instagram",
    action_type: "story",
    label: "Story en Instagram",
    desc: "Comparte una Story mencionando AI4Brands o el evento. Puedes etiquetarnos.",
    xp: 100,
    urlHint: "https://www.instagram.com/stories/…",
    validate: (u) => u.includes("instagram.com"),
  },
  {
    id: "instagram-comment",
    platform: "instagram",
    action_type: "comment",
    label: "Comenta en Instagram",
    desc: "Comenta en uno de los posts de @ai4brands o @yellowagencia en Instagram.",
    xp: 60,
    urlHint: "https://www.instagram.com/p/…",
    validate: (u) => u.includes("instagram.com"),
  },
  // YouTube
  {
    id: "youtube-video",
    platform: "youtube",
    action_type: "video",
    label: "Vídeo / Short en YouTube",
    desc: "Sube un vídeo o Short hablando sobre IA en marketing o sobre AI4Brands.",
    xp: 300,
    urlHint: "https://www.youtube.com/watch?v=… o https://youtube.com/shorts/…",
    validate: (u) => u.includes("youtube.com") || u.includes("youtu.be"),
  },
  {
    id: "youtube-comment",
    platform: "youtube",
    action_type: "comment",
    label: "Comenta en un vídeo oficial",
    desc: "Deja un comentario en uno de los vídeos del canal AI4Brands en YouTube.",
    xp: 60,
    urlHint: "https://www.youtube.com/watch?v=…",
    validate: (u) => u.includes("youtube.com") || u.includes("youtu.be"),
  },
];

const PLATFORM_CONFIG = {
  linkedin:  { label: "LinkedIn",  icon: "💼", color: "#0A66C2", bg: "rgba(10,102,194,.15)" },
  instagram: { label: "Instagram", icon: "📸", color: "#E1306C", bg: "rgba(225,48,108,.15)" },
  youtube:   { label: "YouTube",   icon: "▶️", color: "#FF0000", bg: "rgba(255,0,0,.12)" },
};

/* ─── Single action card ─────────────────────────────────────────── */
function ActionCard({
  action,
  submitted,
  onSubmit,
}: {
  action: SocialAction;
  submitted: boolean;
  onSubmit: (actionId: string, url: string) => Promise<void>;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pc = PLATFORM_CONFIG[action.platform];

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    if (!action.validate(url.trim())) {
      setError(`Introduce un enlace válido de ${pc.label}.`);
      return;
    }
    setError("");
    setLoading(true);
    await onSubmit(action.id, url.trim());
    setLoading(false);
    setUrl("");
  }

  if (submitted) {
    return (
      <div className="rounded-[18px] border p-4 flex items-center gap-3"
        style={{ background: "rgba(77,255,157,.07)", border: "1px solid rgba(77,255,157,.2)" }}>
        <span className="text-[20px]">✅</span>
        <div className="flex-1">
          <div className="font-black text-[13px]" style={{ color: "#4DFF9D" }}>{action.label}</div>
          <div className="text-[11px] text-[#737D9D] mt-0.5">En revisión · +{action.xp} XP pendiente</div>
        </div>
      </div>
    );
  }

  return (
    <details className="rounded-[18px] border overflow-hidden"
      style={{ background: "rgba(23,29,52,.86)", border: "1px solid rgba(255,255,255,.09)" }}>
      <summary className="list-none cursor-pointer p-4 flex items-center gap-3">
        <div className="w-[40px] h-[40px] rounded-[13px] grid place-items-center text-[18px] flex-none"
          style={{ background: pc.bg }}>
          {pc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-[13px] text-white">{action.label}</div>
          <div className="text-[11px] text-[#737D9D] mt-0.5 truncate">{action.desc}</div>
        </div>
        <span className="font-black text-[12px] flex-none" style={{ color: "#FFD400" }}>+{action.xp} XP</span>
      </summary>

      <form onSubmit={handle} className="px-4 pb-4 pt-1 border-t border-[rgba(255,255,255,.08)]">
        <p className="text-[12px] text-[#A9B1CB] my-2">{action.desc}</p>
        <input
          type="url"
          value={url}
          onChange={e => { setUrl(e.target.value); setError(""); }}
          placeholder={action.urlHint}
          className="w-full rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5 text-[12px] text-white outline-none focus:border-[rgba(255,212,0,.4)] transition-colors"
        />
        {error && <p className="text-[11px] text-[#FF5C7A] mt-1 mb-0">{error}</p>}
        <button type="submit" disabled={loading || !url.trim()}
          className="w-full mt-2 rounded-[12px] py-2.5 font-black text-[13px] border-0 cursor-pointer transition-all"
          style={{
            background: url.trim() ? pc.bg : "rgba(255,255,255,.07)",
            color: url.trim() ? pc.color : "#737D9D",
            border: `1px solid ${url.trim() ? pc.color + "40" : "rgba(255,255,255,.07)"}`,
          }}>
          {loading ? "Enviando…" : `Validar y ganar +${action.xp} XP`}
        </button>
      </form>
    </details>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */

export function SocialPage() {
  const dispatch = useDispatch();
  const dbUser = useDBUser();
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [totalEarned, setTotalEarned] = useState(0);

  useEffect(() => {
    if (!dbUser?.id) return;
    const supabase = createClient();
    supabase.from("social_actions").select("action_type, xp_awarded")
      .eq("user_id", dbUser.id)
      .then(({ data }) => {
        if (!data) return;
        setSubmitted(new Set(data.map(r => `${r.action_type}`)));
        setTotalEarned(data.reduce((s, r) => s + (r.xp_awarded ?? 0), 0));
      });
  }, [dbUser?.id]);

  async function handleSubmit(actionId: string, url: string) {
    if (!dbUser?.id) return;
    const action = ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    const supabase = createClient();
    await supabase.from("social_actions").insert([{
      user_id: dbUser.id,
      platform: action.platform,
      action_type: action.id,
      url,
      xp_awarded: action.xp,
      status: "pending",
    }]);

    // Award XP immediately (admin can revoke if invalid)
    const { data: user } = await supabase.from("users").select("xp").eq("id", dbUser.id).single();
    if (user) {
      await supabase.from("users").update({ xp: (user.xp ?? 0) + action.xp }).eq("id", dbUser.id);
      dispatch({ type: "ADD_XP", amount: action.xp });
    }

    setSubmitted(prev => new Set([...prev, actionId]));
    setTotalEarned(prev => prev + action.xp);
  }

  const platforms = ["linkedin", "instagram", "youtube"] as const;

  return (
    <div>
      <BackBar title="Redes Sociales" subtitle="Publica, comenta y gana XP" />

      {/* Summary */}
      <div className="rounded-[18px] border p-4 mb-5 flex items-center gap-3"
        style={{ background: "rgba(255,212,0,.08)", border: "1px solid rgba(255,212,0,.2)" }}>
        <span className="text-[24px]">📱</span>
        <div>
          <div className="font-black text-[14px] text-white">
            Amplifica el ecosistema AI4Brands
          </div>
          <div className="text-[11px] text-[#A9B1CB] mt-0.5">
            Cada publicación es revisada por el equipo. El XP se acredita de inmediato y puede revocarse si el contenido no es válido.
          </div>
        </div>
        {totalEarned > 0 && (
          <div className="flex-none text-right">
            <div className="font-black text-[16px]" style={{ color: "#FFD400" }}>{totalEarned}</div>
            <div className="text-[9px] text-[#737D9D]">XP ganados</div>
          </div>
        )}
      </div>

      {/* Platforms */}
      {platforms.map(platform => {
        const pc = PLATFORM_CONFIG[platform];
        const platformActions = ACTIONS.filter(a => a.platform === platform);
        const doneCount = platformActions.filter(a => submitted.has(a.id)).length;

        return (
          <div key={platform} className="mb-5">
            {/* Platform header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-[32px] h-[32px] rounded-[10px] grid place-items-center text-[16px]"
                style={{ background: pc.bg }}>
                {pc.icon}
              </div>
              <div className="flex-1">
                <div className="font-black text-[14px] text-white">{pc.label}</div>
              </div>
              <span className="text-[11px] text-[#737D9D]">{doneCount}/{platformActions.length} acciones</span>
            </div>

            <div className="grid gap-[8px]">
              {platformActions.map(action => (
                <ActionCard
                  key={action.id}
                  action={action}
                  submitted={submitted.has(action.id)}
                  onSubmit={handleSubmit}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Tip */}
      <div className="rounded-[16px] border p-4"
        style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
        <div className="text-[11px] text-[#737D9D] leading-relaxed">
          💡 <strong style={{ color: "#A9B1CB" }}>Tip:</strong> Los posts con más engagement tienen más probabilidad de ser validados y destacados en nuestros canales oficiales.
        </div>
      </div>
    </div>
  );
}
