import { OrgAdminPage } from "@/components/admin/OrgAdminPage";
export const dynamic = "force-dynamic";

export default function HubsPage() {
  return (
    <OrgAdminPage
      type="hub"
      title="Hubs & Labs"
      icon="🏗️"
      emptyMessage="Sin hubs registrados todavía. Aparecerán aquí cuando completen el Hub Quest."
      fieldLabels={[{ key: "ecosystem_tag", label: "Tipo de hub" }]}
    />
  );
}
