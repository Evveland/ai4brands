export const dynamic = "force-dynamic";

import { getUsers } from "@/lib/supabase/admin-queries";
import { SectionHeader } from "@/components/admin/AdminCard";
import { UsersManager } from "@/components/admin/UsersManager";

export default async function UsersPage() {
  const users = await getUsers(500);

  return (
    <div>
      <SectionHeader
        title="Usuarios"
        subtitle={`${users.length} registros · ordenados por XP`}
      />
      <UsersManager users={users} />
    </div>
  );
}
