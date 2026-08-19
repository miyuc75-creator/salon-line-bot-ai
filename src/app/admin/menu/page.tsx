import { AdminHeader } from "@/components/admin/AdminHeader";
import { MenuManager } from "./MenuManager";
import { getMenus } from "./actions";

export default async function MenuPage() {
  const menus = await getMenus();

  return (
    <>
      <AdminHeader title="メニュー・料金" />
      <div className="px-4 py-6">
        <MenuManager menus={menus} />
      </div>
    </>
  );
}
