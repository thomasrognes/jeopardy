import React, { useState } from "react";

import "./Header.css";
import { Modal } from "../Modal/Modal";
import { useAllTeam } from "../../hooks/teamHooks";

export function Header() {
  const { leaderBoard, setLeaderBoard } = useAllTeam();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");

  return (
    <header className="header">
      <div />
      <h1>Jeopardy</h1>
      <button onClick={() => setIsModalOpen(true)}>Legg til lag</button>
      {isModalOpen && (
        <Modal
          title={"Legg til lagnavn"}
          isOpen={isModalOpen}
          setIsOpen={() => setIsModalOpen(!isModalOpen)}
          onCompleteClick={onCompleteClick}
        >
          <input
            type="text"
            id="name"
            name="Lagnavn"
            required
            onChange={(e) => setTeamName(e.target.value)}
          />
        </Modal>
      )}
    </header>
  );

  function onCompleteClick() {
    setLeaderBoard([...leaderBoard, { name: teamName, score: 0 }]);
    setIsModalOpen(false);
  }
}
