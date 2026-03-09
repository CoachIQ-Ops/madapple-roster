import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PositionBadges } from "@/components/position-badge";
import type { Player } from "@/lib/airtable";

function getInitials(name: string): string {
  if (!name.trim()) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function PlayerCard({ player }: { player: Player }) {
  const isCommitted = !!player.commitment;

  return (
    <Card
      className={`group transition-all ${
        isCommitted
          ? "border-ma-red/30 hover:border-ma-red/50"
          : "hover:border-ma-red/30"
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar
            className={`h-14 w-14 border-2 ${
              isCommitted ? "border-ma-red/40" : "border-muted"
            }`}
          >
            <AvatarFallback
              className={`font-bold text-lg ${
                isCommitted
                  ? "bg-ma-red-light text-ma-red"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {getInitials(player.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tabular-nums text-ma-red leading-none">
                #{player.number}
              </span>
            </div>
            <h3 className="font-semibold truncate">{player.name}</h3>
            <PositionBadges positions={player.position} />
            <div className="flex items-center gap-2 pt-1">
              {player.gradYear && (
                <span className="text-xs text-muted-foreground">
                  Class of {player.gradYear}
                </span>
              )}
            </div>
            {player.commitment && (
              <Badge className="bg-ma-red-light text-ma-red border-ma-red/30 text-xs mt-1" variant="outline">
                {player.commitment}
              </Badge>
            )}
            {player.recruitingLink && (
              <a
                href={player.recruitingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-md text-xs font-medium bg-ma-charcoal-light text-ma-grey border border-ma-charcoal/40 hover:bg-ma-charcoal/30 hover:text-white transition-colors"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Recruiting Profile
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
