import React, { useState } from "react";

import "./Header.css";
import { Modal } from "../Modal/Modal";
export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  function addTeam() {
    setIsModalOpen(true);
  }
  return (
    <header className="header">
      <div>Tabell</div>
      <h1>Jeopardy</h1>
      <button onClick={addTeam}>Legg til lag</button>
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
    console.log(teamName);
  }
}
