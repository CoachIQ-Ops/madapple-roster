import { Badge } from "@/components/ui/badge";

const positionColors: Record<string, string> = {
  P: "bg-ma-red-light text-ma-red border-ma-red/30",
  C: "bg-blue-600/15 text-blue-400 border-blue-600/30",
  "1B": "bg-ma-charcoal-light text-ma-grey border-ma-charcoal/40",
  "2B": "bg-ma-charcoal-light text-ma-grey border-ma-charcoal/40",
  "3B": "bg-ma-charcoal-light text-ma-grey border-ma-charcoal/40",
  SS: "bg-ma-charcoal-light text-ma-grey border-ma-charcoal/40",
  IF: "bg-ma-charcoal-light text-ma-grey border-ma-charcoal/40",
  MI: "bg-ma-charcoal-light text-ma-grey border-ma-charcoal/40",
  OF: "bg-amber-600/15 text-amber-400 border-amber-600/30",
  CF: "bg-amber-600/15 text-amber-400 border-amber-600/30",
  UTL: "bg-ma-red-light text-ma-red border-ma-red/20",
  LHP: "bg-ma-red-light text-ma-red border-ma-red/30",
};

function getPositionColor(pos: string): string {
  const trimmed = pos.trim();
  return positionColors[trimmed] || "bg-muted text-muted-foreground border-border";
}

export function PositionBadge({ position }: { position: string }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${getPositionColor(position)}`}>
      {position.trim()}
    </Badge>
  );
}

export function PositionBadges({ positions }: { positions: string | null }) {
  if (!positions) return null;
  const parts = positions.split(/[/,]/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="flex flex-wrap gap-1">
      {parts.map((pos) => (
        <PositionBadge key={pos} position={pos} />
      ))}
    </div>
  );
}
