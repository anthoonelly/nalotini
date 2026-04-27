interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-14 w-14 text-base",
};

export default function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  // Deterministic color from name
  const palette = [
    "bg-brand-100 text-brand-800",
    "bg-amber-100 text-amber-800",
    "bg-emerald-100 text-emerald-800",
    "bg-rose-100 text-rose-800",
    "bg-violet-100 text-violet-800",
    "bg-sky-100 text-sky-800",
  ];
  const idx = name.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % palette.length;

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold ${palette[idx]} ${SIZES[size]} ${className}`}
      aria-hidden
    >
      {initials || "?"}
    </div>
  );
}
