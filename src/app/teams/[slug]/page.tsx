import Link from "next/link";
import { notFound } from "next/navigation";
import { getTeamBySlug, getPlayersByTeamId } from "@/lib/airtable";
import { RosterWithFilters } from "@/components/roster-filters";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);
  if (!team) return { title: "Team Not Found" };
  return {
    title: `${team.name} | Mad Apple Softball`,
    description: `View the ${team.name} roster for the 2025-2026 season. Coach ${team.headCoach}.`,
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const players = await getPlayersByTeamId(team.id);
  const committedCount = players.filter((p) => p.commitment).length;
  const recruitingCount = players.filter((p) => p.recruitingLink).length;

  // Class breakdown
  const classBreakdown = players.reduce<Record<number, number>>((acc, p) => {
    if (p.gradYear) acc[p.gradYear] = (acc[p.gradYear] || 0) + 1;
    return acc;
  }, {});
  const sortedClasses = Object.entries(classBreakdown)
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => a.year - b.year);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-ma-charcoal transition-colors"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        All Teams
      </Link>

      {/* Team header */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="h-1.5 bg-gradient-to-r from-ma-red via-ma-red to-ma-charcoal" />
        <div className="px-6 sm:px-8 py-7 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-ma-charcoal text-white text-xs font-semibold tracking-wide">
                  {team.ageGroup}
                </span>
                <span className="text-xs text-muted-foreground tracking-wide">
                  {team.season}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ma-charcoal leading-tight">
                {team.name}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-ma-red"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Head Coach{" "}
                <span className="text-ma-charcoal font-medium">
                  {team.headCoach}
                </span>
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 lg:min-w-[420px]">
              <StatChip label="Players" value={players.length} />
              <StatChip
                label="Committed"
                value={committedCount}
                tone="emerald"
              />
              <StatChip
                label="Recruiting"
                value={recruitingCount}
                tone="charcoal"
              />
            </div>
          </div>

          {sortedClasses.length > 0 && (
            <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Classes
              </span>
              {sortedClasses.map(({ year, count }) => (
                <span
                  key={year}
                  className="inline-flex items-baseline gap-1.5 text-sm"
                >
                  <span className="font-semibold text-ma-charcoal tabular-nums">
                    {count}
                  </span>
                  <span className="text-muted-foreground">
                    · Class of{" "}
                    <span className="tabular-nums">{year}</span>
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Roster */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-ma-charcoal">
          Roster
        </h2>
        <RosterWithFilters key={team.id} players={players} />
      </section>
    </div>
  );
}

function StatChip({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "emerald" | "charcoal";
}) {
  const toneStyles =
    tone === "emerald"
      ? "border-emerald-200 bg-ma-emerald-tint"
      : tone === "charcoal"
      ? "border-border bg-secondary/60"
      : "border-border bg-secondary/40";

  const valueStyles =
    tone === "emerald"
      ? "text-emerald-700"
      : tone === "charcoal"
      ? "text-ma-charcoal"
      : "text-ma-red";

  return (
    <div
      className={`rounded-lg border ${toneStyles} px-3 py-2.5 text-center sm:text-left`}
    >
      <div
        className={`text-2xl font-bold tabular-nums leading-none ${valueStyles}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] tracking-wider text-muted-foreground uppercase font-medium">
        {label}
      </div>
    </div>
  );
}
