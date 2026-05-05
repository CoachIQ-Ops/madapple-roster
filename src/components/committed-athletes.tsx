import Link from "next/link";

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
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl font-semibold tracking-tight text-ma-charcoal">
              College Commitments
            </h2>
            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-ma-emerald-tint text-emerald-700 text-xs font-semibold">
              {players.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Mad Apple athletes signed to play at the next level.
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {players.map((player) => (
          <Link
            key={`${player.teamSlug}-${player.number}-${player.name}`}
            href={`/teams/${player.teamSlug}`}
            className="flex-shrink-0 group"
          >
            <div className="w-[260px] h-full rounded-xl border border-emerald-200 bg-gradient-to-br from-white to-ma-emerald-tint p-4 transition-all hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-3">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-600 text-white text-sm font-bold tabular-nums shadow-sm">
                  #{player.number}
                </span>
                <svg
                  className="h-5 w-5 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l2.39 7.36H22l-6.19 4.5L18.2 21 12 16.5 5.8 21l2.39-7.14L2 9.36h7.61z" />
                </svg>
              </div>
              <div className="font-semibold text-ma-charcoal truncate">
                {player.name}
              </div>
              <div className="text-sm font-medium text-emerald-700 truncate mt-0.5">
                {player.commitment}
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate">
                  {player.teamName}
                </span>
                <span className="text-xs text-emerald-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
