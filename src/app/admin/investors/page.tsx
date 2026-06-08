export const dynamic = "force-dynamic";
import { OrgAdminPage } from "@/components/admin/OrgAdminPage";

export default function InvestorsPage() {
  return (
    <OrgAdminPage
      type="investor"
      title="Inversores"
      icon="💰"
      emptyMessage="Sin inversores registrados todavía. Aparecerán aquí cuando completen el Investor Quest."
      fieldLabels={[
        { key: "ecosystem_tag", label: "Tipo" },
      ]}
    />
  );
}
