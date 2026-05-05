import Link from "next/link";
import type { Team } from "@/lib/airtable";

export function TeamCard({
  team,
  playerCount,
  committedCount,
  recruitingCount,
}: {
  team: Team;
  playerCount: number;
  committedCount: number;
  recruitingCount: number;
}) {
  return (
    <Link href={`/teams/${team.slug}`} className="group block h-full">
      <article className="relative h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-ma-red/40 hover:shadow-lg hover:-translate-y-0.5">
        {/* Top accent stripe */}
        <div className="h-1 bg-gradient-to-r from-ma-red via-ma-red to-ma-charcoal" />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-ma-charcoal text-white text-[11px] font-semibold tracking-wide">
                  {team.ageGroup}
                </span>
                <span className="text-[11px] text-muted-foreground tracking-wide">
                  {team.season}
                </span>
              </div>
              <h3 className="text-base font-semibold text-ma-charcoal leading-tight group-hover:text-ma-red transition-colors">
                {team.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Coach {team.headCoach}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold tabular-nums text-ma-charcoal leading-none">
                {playerCount}
              </div>
              <div className="text-[10px] tracking-wider text-muted-foreground uppercase mt-1">
                Players
              </div>
            </div>
          </div>

          {(committedCount > 0 || recruitingCount > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {committedCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-ma-emerald-tint text-emerald-700 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {committedCount} committed
                </span>
              )}
              {recruitingCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-secondary text-ma-charcoal font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-ma-grey" />
                  {recruitingCount} recruiting
                </span>
              )}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground group-hover:text-ma-red transition-colors font-medium">
              View Roster
            </span>
            <svg
              className="h-4 w-4 text-muted-foreground transition-all group-hover:text-ma-red group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}
