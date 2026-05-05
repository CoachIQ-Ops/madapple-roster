"use client";

import { useState } from "react";
import { TeamCard } from "@/components/team-card";
import type { Team } from "@/lib/airtable";
import { AGE_GROUPS } from "@/lib/airtable";

interface Props {
  teams: Team[];
  playerCounts: Record<string, number>;
  committedCounts: Record<string, number>;
  recruitingCounts: Record<string, number>;
}

export function AgeGroupTabs({
  teams,
  playerCounts,
  committedCounts,
  recruitingCounts,
}: Props) {
  const teamsByAge = AGE_GROUPS.reduce(
    (acc, ag) => {
      acc[ag] = teams.filter((t) => t.ageGroup === ag);
      return acc;
    },
    {} as Record<string, Team[]>
  );

  const activeGroups = AGE_GROUPS.filter((ag) => teamsByAge[ag].length > 0);
  const [selected, setSelected] = useState<string>("all");

  const visibleTeams =
    selected === "all"
      ? activeGroups.flatMap((ag) => teamsByAge[ag])
      : teamsByAge[selected] || [];

  // Group by age when "all" is selected so it's still organized
  const grouped =
    selected === "all"
      ? activeGroups.map((ag) => ({ ageGroup: ag, teams: teamsByAge[ag] }))
      : [{ ageGroup: selected, teams: visibleTeams }];

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ma-charcoal">
            All Teams
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse rosters by age group.
          </p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelected("all")}
          className={pillClass(selected === "all")}
        >
          All
          <span className={countBadgeClass(selected === "all")}>
            {teams.length}
          </span>
        </button>
        {activeGroups.map((ag) => (
          <button
            key={ag}
            type="button"
            onClick={() => setSelected(ag)}
            className={pillClass(selected === ag)}
          >
            {ag}
            <span className={countBadgeClass(selected === ag)}>
              {teamsByAge[ag].length}
            </span>
          </button>
        ))}
      </div>

      {/* Grouped teams */}
      <div className="space-y-8">
        {grouped.map(({ ageGroup, teams: groupTeams }) => (
          <div key={ageGroup} className="space-y-3">
            {selected === "all" && (
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  {ageGroup}
                </h3>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground tabular-nums">
                  {groupTeams.length} team{groupTeams.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  playerCount={playerCounts[team.id] || 0}
                  committedCount={committedCounts[team.id] || 0}
                  recruitingCount={recruitingCounts[team.id] || 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function pillClass(active: boolean): string {
  return [
    "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all",
    active
      ? "bg-ma-charcoal text-white shadow-sm"
      : "bg-card text-ma-charcoal border border-border hover:border-ma-charcoal/30 hover:bg-secondary/60",
  ].join(" ");
}

function countBadgeClass(active: boolean): string {
  return [
    "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold tabular-nums",
    active ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground",
  ].join(" ");
}
