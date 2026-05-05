"use client";

import { useState, useMemo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PositionBadges } from "@/components/position-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Player } from "@/lib/airtable";

type SortKey = "number" | "name" | "position" | "gradYear" | "status";
type SortDir = "asc" | "desc";

function getInitials(name: string): string {
  if (!name.trim()) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function statusRank(p: Player): number {
  if (p.commitment) return 0;
  if (p.recruitingLink) return 1;
  return 2;
}

function compare(a: Player, b: Player, key: SortKey, dir: SortDir): number {
  const mul = dir === "asc" ? 1 : -1;
  switch (key) {
    case "number":
      return (a.number - b.number) * mul;
    case "name":
      return a.name.localeCompare(b.name) * mul;
    case "position":
      return (a.position || "zzz").localeCompare(b.position || "zzz") * mul;
    case "gradYear": {
      const av = a.gradYear ?? Number.POSITIVE_INFINITY;
      const bv = b.gradYear ?? Number.POSITIVE_INFINITY;
      return (av - bv) * mul;
    }
    case "status":
      return (statusRank(a) - statusRank(b)) * mul;
  }
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
  align = "left",
  className = "",
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  const alignCls =
    align === "right"
      ? "justify-end"
      : align === "center"
      ? "justify-center"
      : "justify-start";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-1 w-full ${alignCls} text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-ma-charcoal transition-colors ${className}`}
    >
      <span>{label}</span>
      <span
        className={`text-[10px] transition-opacity ${
          active ? "opacity-100 text-ma-red" : "opacity-30 group-hover:opacity-60"
        }`}
        aria-hidden
      >
        {active ? (dir === "asc" ? "▲" : "▼") : "⇅"}
      </span>
    </button>
  );
}

export function RosterTable({ players }: { players: Player[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("number");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    return [...players].sort((a, b) => compare(a, b, sortKey, sortDir));
  }, [players, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "number" || key === "gradYear" ? "asc" : "asc");
    }
  };

  if (players.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 py-16 text-center text-sm text-muted-foreground">
        No players match the selected filters.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50 border-b border-border">
            <TableHead className="w-16 pl-4">
              <SortHeader
                label="#"
                active={sortKey === "number"}
                dir={sortDir}
                onClick={() => handleSort("number")}
                align="left"
              />
            </TableHead>
            <TableHead className="min-w-[200px]">
              <SortHeader
                label="Player"
                active={sortKey === "name"}
                dir={sortDir}
                onClick={() => handleSort("name")}
              />
            </TableHead>
            <TableHead className="min-w-[180px]">
              <SortHeader
                label="Position"
                active={sortKey === "position"}
                dir={sortDir}
                onClick={() => handleSort("position")}
              />
            </TableHead>
            <TableHead className="w-32 hidden sm:table-cell">
              <SortHeader
                label="Class"
                active={sortKey === "gradYear"}
                dir={sortDir}
                onClick={() => handleSort("gradYear")}
              />
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <SortHeader
                label="Status"
                active={sortKey === "status"}
                dir={sortDir}
                onClick={() => handleSort("status")}
              />
            </TableHead>
            <TableHead className="w-12 pr-4" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((player, idx) => {
            const isCommitted = !!player.commitment;
            return (
              <TableRow
                key={player.id}
                className={`group transition-colors ${
                  idx % 2 === 1 ? "bg-secondary/20" : ""
                } ${
                  isCommitted
                    ? "hover:bg-emerald-50"
                    : "hover:bg-ma-red-tint/40"
                }`}
              >
                {/* # */}
                <TableCell className="pl-4 font-bold tabular-nums text-ma-red text-lg">
                  {player.number}
                </TableCell>

                {/* Player */}
                <TableCell>
                  <div className="flex items-center gap-3 py-1">
                    <Avatar
                      className={`h-9 w-9 border ${
                        isCommitted
                          ? "border-emerald-300"
                          : "border-border"
                      }`}
                    >
                      <AvatarFallback
                        className={`text-xs font-semibold ${
                          isCommitted
                            ? "bg-ma-emerald-tint text-emerald-700"
                            : "bg-ma-charcoal-tint text-ma-charcoal"
                        }`}
                      >
                        {getInitials(player.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-semibold text-ma-charcoal truncate">
                        {player.name}
                      </div>
                      {/* Mobile-only meta line */}
                      <div className="sm:hidden text-xs text-muted-foreground">
                        {player.gradYear ? `Class of ${player.gradYear}` : ""}
                        {player.commitment && (
                          <span className="text-emerald-700 font-medium">
                            {player.gradYear ? " · " : ""}
                            {player.commitment}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Position */}
                <TableCell>
                  <PositionBadges positions={player.position} />
                </TableCell>

                {/* Class — hidden on mobile (shown inline above) */}
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground tabular-nums">
                  {player.gradYear ? (
                    <span>Class of {player.gradYear}</span>
                  ) : (
                    <span className="text-muted-foreground/70">—</span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell className="hidden lg:table-cell">
                  {player.commitment ? (
                    <Badge
                      variant="outline"
                      className="bg-ma-emerald-tint text-emerald-700 border-emerald-200 font-medium"
                    >
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                      {player.commitment}
                    </Badge>
                  ) : player.recruitingLink ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-ma-grey" />
                      Recruiting
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/60">—</span>
                  )}
                </TableCell>

                {/* Recruiting link icon */}
                <TableCell className="pr-4 text-right">
                  {player.recruitingLink ? (
                    <a
                      href={player.recruitingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Recruiting profile"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-ma-red hover:bg-ma-red-tint transition-colors"
                      aria-label={`${player.name} recruiting profile`}
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
