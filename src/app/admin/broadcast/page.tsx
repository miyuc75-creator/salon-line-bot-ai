import { AdminHeader } from "@/components/admin/AdminHeader";
import { BroadcastForm } from "./BroadcastForm";
import { getAnnouncements } from "./actions";

export default async function BroadcastPage() {
  const history = await getAnnouncements();

  return (
    <>
      <AdminHeader title="お知らせ配信" />
      <div className="px-4 py-6">
        <BroadcastForm history={history} />
      </div>
    </>
  );
}
