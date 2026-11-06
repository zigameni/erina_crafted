export function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-8 w-8 text-[13px]" : "h-9 w-9 text-sm";

  return (
    <span
      aria-hidden
      className={`${box} flex items-center justify-center rounded-lg border border-gold/35 bg-gold/10 font-display text-gold-soft`}
    >
      E
    </span>
  );
}
