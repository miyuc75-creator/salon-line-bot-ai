import Link from "next/link";

type AdminHeaderProps = {
  title: string;
  backHref?: string;
};

export function AdminHeader({ title, backHref = "/admin" }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-4">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <Link
          href={backHref}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
          aria-label="戻る"
        >
          ←
        </Link>
        <h1 className="flex-1 text-lg font-bold text-zinc-800">{title}</h1>
      </div>
    </header>
  );
}
