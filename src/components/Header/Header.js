import React, { useState } from "react";

import "./Header.css";
import { Modal } from "../Modal/Modal";
import { useAllTeam } from "../../hooks/teamHooks";

export function Header() {
  const { teams, setTeams } = useAllTeam();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <header className="header">
      <div />
      <h1>Musikk Jeopardy</h1>
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
          <form className="add-team-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="name">Lagnavn</label>
            <input
              type="text"
              id="name"
              name="Lagnavn"
              required
              onChange={(e) => {
                setTeamName(e.target.value);
                setErrorMessage("");
              }}
            />
            <span className="error">{errorMessage}</span>
          </form>
          <button className="complete-button" onClick={onCompleteClick}>
            Fullfør
          </button>
        </Modal>
      )}
    </header>
  );

  function onCompleteClick() {
    if (teamName === "") {
      setErrorMessage("Lagnavn kan ikke være tomt.");
      return;
    }
    setTeams([...teams, { name: teamName, score: 0 }]);
    setIsModalOpen(false);
  }
}
