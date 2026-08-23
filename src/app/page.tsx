import { getTeams, getPlayers, AGE_GROUPS } from "@/lib/airtable";
import { AgeGroupTabs } from "@/components/age-group-tabs";
import { CommittedAthletes } from "@/components/committed-athletes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [teams, players] = await Promise.all([getTeams(), getPlayers()]);

  const teamMap = new Map(teams.map((t) => [t.id, t]));

  const playerCounts: Record<string, number> = {};
  const committedCounts: Record<string, number> = {};
  const recruitingCounts: Record<string, number> = {};

  for (const player of players) {
    for (const teamId of player.teamIds) {
      if (!teamMap.has(teamId)) continue;
      playerCounts[teamId] = (playerCounts[teamId] || 0) + 1;
      if (player.commitment) {
        committedCounts[teamId] = (committedCounts[teamId] || 0) + 1;
      }
      if (player.recruitingLink) {
        recruitingCounts[teamId] = (recruitingCounts[teamId] || 0) + 1;
      }
    }
  }

  const committedPlayers = players
    .filter((p) => p.commitment && p.teamId && teamMap.has(p.teamId))
    .map((p) => {
      const team = teamMap.get(p.teamId)!;
      return {
        name: p.name,
        number: p.number,
        position: p.position,
        commitment: p.commitment!,
        teamSlug: team.slug,
        teamName: team.name,
      };
    });

  const totalCommitted = committedPlayers.length;
  const totalRecruiting = players.filter((p) => p.recruitingLink).length;
  const ageGroupsActive = AGE_GROUPS.filter((ag) =>
    teams.some((t) => t.ageGroup === ag)
  ).length;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-ma-charcoal via-ma-charcoal to-[#1f2d35] text-white shadow-lg">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px, 48px 48px",
          }}
        />
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-ma-red opacity-15 blur-3xl pointer-events-none" />
        <div className="relative px-6 sm:px-10 py-10 sm:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium tracking-wider uppercase backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-ma-red animate-pulse" />
                2025 – 2026 Season
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
                Mad Apple{" "}
                <span className="text-ma-red">Softball</span> Rosters
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
                Every athlete, every team. Browse rosters across all age groups,
                find players by position or class, and meet our committed
                college signees.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 lg:max-w-md">
              <Stat label="Teams" value={teams.length} />
              <Stat label="Athletes" value={players.length} />
              <Stat
                label="Committed"
                value={totalCommitted}
                accent="text-emerald-300"
              />
              <Stat
                label="Age Groups"
                value={ageGroupsActive}
                accent="text-ma-red"
              />
            </div>
          </div>
        </div>
      </section>

      <CommittedAthletes players={committedPlayers} />

      <AgeGroupTabs
        teams={teams}
        playerCounts={playerCounts}
        committedCounts={committedCounts}
        recruitingCounts={recruitingCounts}
      />

      {totalRecruiting > 0 && (
        <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border/60">
          <span className="tabular-nums">{totalRecruiting}</span>{" "}
          {totalRecruiting === 1 ? "athlete is" : "athletes are"} actively
          recruiting. Open any team roster to view profiles.
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent = "text-white",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-3">
      <div className={`text-2xl font-bold tabular-nums leading-none ${accent}`}>
        {value}
      </div>
      <div className="mt-1 text-[11px] tracking-wider text-white/60 uppercase">
        {label}
      </div>
    </div>
  );
}
