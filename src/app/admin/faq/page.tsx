import { AdminHeader } from "@/components/admin/AdminHeader";
import { FaqManager } from "./FaqManager";
import { getFaqs } from "./actions";

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <AdminHeader title="FAQ管理" />
      <div className="px-4 py-6">
        <FaqManager faqs={faqs} />
      </div>
    </>
  );
}
