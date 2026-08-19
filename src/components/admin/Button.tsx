"use client";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

export function Button({
  variant = "primary",
  loading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-3 text-base font-semibold transition active:scale-[0.98] disabled:opacity-50";
  const variants = {
    primary: "bg-rose-500 text-white hover:bg-rose-600",
    secondary: "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        children
      )}
    </button>
  );
}
