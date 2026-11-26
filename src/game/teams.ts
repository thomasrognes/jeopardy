export interface Team {
  name: string;
  score: number;
  // Plass i fargelisten. Mangler i spill som er lagret av eldre versjoner.
  color?: number;
}

// Lyse farger som skiller seg i lyshet og tåler mørk tekst.
export const TEAM_COLORS = [
  "#ff8a6b",
  "#4fe0cf",
  "#c3adff",
  "#cfe95a",
  "#ff9ed2",
  "#7cc4ff",
  "#ffb347",
  "#9cf0a0",
];

function colorIndex(team: Team, position: number) {
  return (team.color ?? position) % TEAM_COLORS.length;
}

export function teamColor(team: Team, position: number) {
  return TEAM_COLORS[colorIndex(team, position)];
}

// Første ledige farge, slik at lagene beholder fargen sin når andre fjernes.
export function nextColor(teams: Team[]) {
  const taken = new Set(teams.map(colorIndex));
  const free = TEAM_COLORS.findIndex((_, index) => !taken.has(index));
  return free === -1 ? teams.length % TEAM_COLORS.length : free;
}

// Tom streng betyr at navnet kan brukes.
export function teamNameError(name: string, otherNames: string[]) {
  const trimmed = name.trim().toLowerCase();

  if (trimmed === "") {
    return "Lagnavn kan ikke være tomt.";
  }
  if (otherNames.some((other) => other.toLowerCase() === trimmed)) {
    return "Det finnes allerede et lag med det navnet.";
  }
  return "";
}

// Lagene sortert etter poeng. Like mange poeng gir samme plass: 1, 2, 2, 4.
export function rankTeams(teams: Team[]) {
  const ranked = teams
    .map((team, position) => ({ team, color: teamColor(team, position) }))
    .sort((a, b) => b.team.score - a.team.score);

  return ranked.map((entry) => ({
    ...entry,
    placement:
      ranked.findIndex((other) => other.team.score === entry.team.score) + 1,
  }));
}
