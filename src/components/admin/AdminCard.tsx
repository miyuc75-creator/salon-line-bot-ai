import Link from "next/link";

type AdminCardProps = {
  href: string;
  title: string;
  description: string;
  icon: string;
};

export function AdminCard({ href, title, description, icon }: AdminCardProps) {
  return (
    <Link
      href={href}
      className="flex min-h-[72px] items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-rose-200 hover:shadow-md active:scale-[0.98]"
    >
      <span className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-rose-50 text-xl">
        {icon}
      </span>
      <div className="flex-1">
        <p className="font-semibold text-zinc-800">{title}</p>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      <span className="text-zinc-400">›</span>
    </Link>
  );
}
