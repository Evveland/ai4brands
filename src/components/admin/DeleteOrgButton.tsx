"use client";

export function DeleteOrgButton({
  orgId,
  orgName,
  deleteAction,
}: {
  orgId: string;
  orgName: string;
  deleteAction: (fd: FormData) => Promise<void>;
}) {
  return (
    <form action={deleteAction} className="inline">
      <input type="hidden" name="org_id" value={orgId} />
      <button
        type="submit"
        className="rounded-[10px] px-3 py-1.5 text-[11px] font-black cursor-pointer border border-[rgba(255,92,122,.3)] bg-[rgba(255,92,122,.08)] text-[#FF5C7A] hover:bg-[rgba(255,92,122,.18)] transition-colors"
        onClick={(e) => {
          if (!confirm(`¿Eliminar "${orgName}"? Se eliminarán todos los datos de la organización y sus miembros.`)) {
            e.preventDefault();
          }
        }}
      >
        🗑 Eliminar organización
      </button>
    </form>
  );
}
