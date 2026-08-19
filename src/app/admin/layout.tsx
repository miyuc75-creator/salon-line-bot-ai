import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex-1 bg-zinc-50">
      <div className="mx-auto min-h-full max-w-lg">
        {children}
      </div>
      <div className="fixed bottom-4 right-4">
        <LogoutButton />
      </div>
    </div>
  );
}
