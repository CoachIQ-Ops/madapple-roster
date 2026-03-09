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
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <h2 className="text-xl font-bold tracking-tight">
          Committed Athletes
        </h2>
        <Badge
          variant="outline"
          className="bg-green-600/15 text-green-400 border-green-600/30"
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
            <div className="w-[220px] rounded-lg border border-green-600/20 bg-green-600/5 p-4 transition-all hover:border-green-500/40 hover:bg-green-600/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold tabular-nums text-green-400">
                  #{player.number}
                </span>
                <span className="font-semibold text-sm truncate">
                  {player.name}
                </span>
              </div>
              <p className="text-xs text-green-400 font-medium mb-1 truncate">
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
