"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlayerCard } from "@/components/player-card";
import type { Player } from "@/lib/airtable";

export function RosterWithFilters({ players }: { players: Player[] }) {
  const [posFilter, setPosFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const positions = useMemo(() => {
    const set = new Set<string>();
    for (const p of players) {
      if (p.position) {
        for (const pos of p.position.split(/[/,]/)) {
          const trimmed = pos.trim();
          if (trimmed) set.add(trimmed);
        }
      }
    }
    return Array.from(set).sort();
  }, [players]);

  const gradYears = useMemo(() => {
    const set = new Set<number>();
    for (const p of players) {
      if (p.gradYear) set.add(p.gradYear);
    }
    return Array.from(set).sort();
  }, [players]);

  const hasCommitted = players.some((p) => p.commitment);
  const hasRecruiting = players.some((p) => p.recruitingLink);

  const filtered = useMemo(() => {
    return players.filter((p) => {
      if (posFilter !== "all") {
        if (!p.position) return false;
        const parts = p.position.split(/[/,]/).map((s) => s.trim());
        if (!parts.includes(posFilter)) return false;
      }
      if (yearFilter !== "all") {
        if (p.gradYear !== Number(yearFilter)) return false;
      }
      if (statusFilter === "committed") {
        if (!p.commitment) return false;
      } else if (statusFilter === "recruiting") {
        if (!p.recruitingLink) return false;
      }
      return true;
    });
  }, [players, posFilter, yearFilter, statusFilter]);

  const hasActiveFilter =
    posFilter !== "all" || yearFilter !== "all" || statusFilter !== "all";

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={posFilter} onValueChange={setPosFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {positions.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {gradYears.length > 0 && (
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Grad Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {gradYears.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  Class of {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {(hasCommitted || hasRecruiting) && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Players</SelectItem>
              {hasCommitted && (
                <SelectItem value="committed">Committed</SelectItem>
              )}
              {hasRecruiting && (
                <SelectItem value="recruiting">Recruiting</SelectItem>
              )}
            </SelectContent>
          </Select>
        )}

        {hasActiveFilter && (
          <button
            onClick={() => {
              setPosFilter("all");
              setYearFilter("all");
              setStatusFilter("all");
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length} player{filtered.length !== 1 ? "s" : ""}
        {hasActiveFilter && " (filtered)"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No players match the selected filters.
        </div>
      )}
    </div>
  );
}
