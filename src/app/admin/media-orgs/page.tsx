export const dynamic = "force-dynamic";
import { OrgAdminPage } from "@/components/admin/OrgAdminPage";

export default function MediaOrgsPage() {
  return (
    <OrgAdminPage
      type="media"
      title="Medios"
      icon="📺"
      emptyMessage="Sin medios registrados todavía. Aparecerán aquí cuando completen el Media Quest."
      fieldLabels={[{ key: "ecosystem_tag", label: "Tipo de medio" }]}
    />
  );
}
