import React, { useState } from "react";

import "./Header.css";
import { Modal } from "../Modal/Modal";
import { useAllTeam } from "../../hooks/teamHooks";

export function Header() {
  const { teams, setTeams } = useAllTeam();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");

  return (
    <header className="header">
      <div />
      <h1>Jeopardy</h1>
      <div className="header-button-content">
        <button
          className="btn-primary btn-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Legg til nytt lag
        </button>
      </div>
      {isModalOpen && (
        <Modal
          title={"Legg til lagnavn"}
          hidden={false}
          onDialogToggle={() => setIsModalOpen(!isModalOpen)}
        >
          <input
            type="text"
            id="name"
            name="Lagnavn"
            required
            onChange={(e) => setTeamName(e.target.value)}
          />
          <button className='complete-button' onClick={onCompleteClick}>Fullfør</button>
        </Modal>
      )}
    </header>
  );

  function onCompleteClick() {
    setTeams([...teams, { name: teamName, score: 0 }]);
    setIsModalOpen(false);
  }
}
