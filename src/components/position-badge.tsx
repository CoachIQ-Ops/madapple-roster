import { Badge } from "@/components/ui/badge";

type ColorClasses = string;

const positionColors: Record<string, ColorClasses> = {
  // Pitchers — red
  P: "bg-ma-red-tint text-ma-red border-ma-red/20",
  LHP: "bg-ma-red-tint text-ma-red border-ma-red/20",
  RHP: "bg-ma-red-tint text-ma-red border-ma-red/20",

  // Catcher — blue
  C: "bg-ma-blue-tint text-blue-700 border-blue-200",

  // Infield — emerald
  "1B": "bg-ma-emerald-tint text-emerald-700 border-emerald-200",
  "2B": "bg-ma-emerald-tint text-emerald-700 border-emerald-200",
  "3B": "bg-ma-emerald-tint text-emerald-700 border-emerald-200",
  SS: "bg-ma-emerald-tint text-emerald-700 border-emerald-200",
  IF: "bg-ma-emerald-tint text-emerald-700 border-emerald-200",
  MI: "bg-ma-emerald-tint text-emerald-700 border-emerald-200",
  CI: "bg-ma-emerald-tint text-emerald-700 border-emerald-200",

  // Outfield — amber
  OF: "bg-ma-amber-tint text-amber-700 border-amber-200",
  CF: "bg-ma-amber-tint text-amber-700 border-amber-200",
  LF: "bg-ma-amber-tint text-amber-700 border-amber-200",
  RF: "bg-ma-amber-tint text-amber-700 border-amber-200",

  // Utility — violet
  UTL: "bg-ma-violet-tint text-violet-700 border-violet-200",
  DP: "bg-ma-violet-tint text-violet-700 border-violet-200",
  FLEX: "bg-ma-violet-tint text-violet-700 border-violet-200",
};

const fallback: ColorClasses =
  "bg-ma-charcoal-tint text-ma-charcoal border-ma-grey/40";

function getPositionColor(pos: string): ColorClasses {
  return positionColors[pos.trim().toUpperCase()] ?? fallback;
}

export function PositionBadge({ position }: { position: string }) {
  const trimmed = position.trim();
  return (
    <Badge
      variant="outline"
      className={`text-[11px] font-semibold tracking-wide ${getPositionColor(trimmed)}`}
    >
      {trimmed}
    </Badge>
  );
}

export function PositionBadges({ positions }: { positions: string | null }) {
  if (!positions) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const parts = positions
    .split(/[/,]/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {parts.map((pos) => (
        <PositionBadge key={pos} position={pos} />
      ))}
    </div>
  );
}
