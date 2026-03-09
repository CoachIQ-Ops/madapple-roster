import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface CommittedPlayer {
  name: string;
  number: number;
  position: string | null;
  commitment: string;
  teamSlug: string;
  teamName: string;
}

export function CommittedAthletes({
  players,
}: {
  players: CommittedPlayer[];
}) {
  if (players.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-ma-red animate-pulse" />
        <h2 className="text-xl font-bold tracking-tight">
          Committed Athletes
        </h2>
        <Badge
          variant="outline"
          className="bg-ma-red-light text-ma-red border-ma-red/30"
        >
          {players.length}
        </Badge>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {players.map((player) => (
          <Link
            key={`${player.teamSlug}-${player.number}-${player.name}`}
            href={`/teams/${player.teamSlug}`}
            className="flex-shrink-0 group"
          >
            <div className="w-[220px] rounded-lg border border-ma-red/20 bg-ma-red-light p-4 transition-all hover:border-ma-red/40 hover:bg-ma-red/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold tabular-nums text-ma-red">
                  #{player.number}
                </span>
                <span className="font-semibold text-sm truncate">
                  {player.name}
                </span>
              </div>
              <p className="text-xs text-ma-red font-medium mb-1 truncate">
                {player.commitment}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {player.teamName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
