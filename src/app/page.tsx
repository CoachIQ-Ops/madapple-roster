import { getTeams, getPlayers } from "@/lib/airtable";
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
    if (player.teamId) {
      playerCounts[player.teamId] = (playerCounts[player.teamId] || 0) + 1;
      if (player.commitment) {
        committedCounts[player.teamId] =
          (committedCounts[player.teamId] || 0) + 1;
      }
      if (player.recruitingLink) {
        recruitingCounts[player.teamId] =
          (recruitingCounts[player.teamId] || 0) + 1;
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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Team Rosters</h1>
        <p className="text-muted-foreground">
          {teams.length} teams &middot; {players.length} athletes &middot;
          2025–2026 Season
        </p>
      </div>
      <CommittedAthletes players={committedPlayers} />
      <AgeGroupTabs
        teams={teams}
        playerCounts={playerCounts}
        committedCounts={committedCounts}
        recruitingCounts={recruitingCounts}
      />
    </div>
  );
}
