"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RosterTable } from "@/components/roster-table";
import type { Player } from "@/lib/airtable";

export function RosterWithFilters({ players }: { players: Player[] }) {
  const [posFilter, setPosFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

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
    const q = search.trim().toLowerCase();
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
      if (q) {
        const hay = `${p.name} ${p.number}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [players, posFilter, yearFilter, statusFilter, search]);

  const hasActiveFilter =
    posFilter !== "all" ||
    yearFilter !== "all" ||
    statusFilter !== "all" ||
    search.length > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 110-16 8 8 0 010 16z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search by name or number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[3px]"
            />
          </div>

          <Select value={posFilter} onValueChange={setPosFilter}>
            <SelectTrigger className="w-[150px]">
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
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
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
              <SelectTrigger className="w-[150px]">
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
                setSearch("");
              }}
              className="text-sm text-ma-red hover:text-ma-red-hover transition-colors px-2 font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-ma-charcoal tabular-nums">
            {filtered.length}
          </span>{" "}
          of {players.length} player{players.length !== 1 ? "s" : ""}
          {hasActiveFilter && " (filtered)"}
        </p>
        <p className="text-xs text-muted-foreground hidden sm:block">
          Click any column header to sort
        </p>
      </div>

      <RosterTable players={filtered} />
    </div>
  );
}
