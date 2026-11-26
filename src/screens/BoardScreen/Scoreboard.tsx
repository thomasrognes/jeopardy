import React from "react";
import classNames from "classnames";
import { teamColor } from "../../game/teams";
import { useAllTeam } from "../../hooks/teamHooks";

export function Scoreboard() {
  const { teams } = useAllTeam();
  const best = Math.max(0, ...teams.map((team) => team.score));

  if (teams.length === 0) {
    return <p className="muted play__no-teams">Ingen lag er lagt til ennå.</p>;
  }

  return (
    <ul
      // Flere enn fire lag får smalere kort med navnet over poengene.
      className={classNames("scoreboard", {
        "scoreboard--compact": teams.length > 4,
      })}
      aria-label="Poeng"
    >
      {teams.map((team, index) => {
        const isLeader = best > 0 && team.score === best;
        const color = teamColor(team, index);
        return (
          <li
            className={classNames("scoreboard__team", {
              "scoreboard__team--leader": isLeader,
            })}
            style={{ borderTopColor: color }}
            key={team.name}
          >
            <div className="scoreboard__about">
              <span className="scoreboard__name">{team.name}</span>
              {best > 0 && (
                <span className="scoreboard__status">
                  {isLeader ? "Leder" : `${best - team.score} bak`}
                </span>
              )}
            </div>
            <span className="scoreboard__score" style={{ color }}>
              {team.score}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
