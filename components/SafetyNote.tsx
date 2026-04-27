interface SafetyNoteProps {
  children: React.ReactNode;
  variant?: "info" | "warning";
}

export default function SafetyNote({ children, variant = "info" }: SafetyNoteProps) {
  const styles =
    variant === "warning"
      ? "bg-amber-50 border-amber-200 text-amber-900"
      : "bg-brand-50/60 border-brand-100 text-brand-900";

  return (
    <div className={`rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed ${styles}`}>
      <div className="flex gap-2">
        <span aria-hidden>{variant === "warning" ? "⚠️" : "ℹ️"}</span>
        <div>{children}</div>
      </div>
    </div>
  );
}
