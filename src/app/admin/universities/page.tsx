export const dynamic = "force-dynamic";
import { OrgAdminPage } from "@/components/admin/OrgAdminPage";

export default function UniversitiesPage() {
  return (
    <OrgAdminPage
      type="university"
      title="Universidades"
      icon="🎓"
      emptyMessage="Sin universidades registradas todavía. Aparecerán aquí cuando completen el University Quest."
      fieldLabels={[{ key: "ecosystem_tag", label: "Tipo" }]}
    />
  );
}
