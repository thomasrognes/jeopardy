import React, { useState } from "react";

import "./Header.scss";
import { Modal } from "../Modal/Modal";
import { MenuButton } from "../MenuButton/MenuButton";
import { GameInfo } from "../GameInfo/GameInfo";
import { useAllTeam } from "../../hooks/teamHooks";
import { useBoard } from "../../hooks/boardHooks";

export function Header() {
  const [isChangeGameModalOpen, setIsChangeGameModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { setTeams } = useAllTeam();
  const { resetBoard } = useBoard();

  return (
    <header className="header">
      <div className="header__buttons">
        <MenuButton
          title={"Velg spill"}
          onClick={() => setIsChangeGameModalOpen(true)}
        />
        <MenuButton
          title={"Nullstill spill"}
          onClick={() => setIsResetModalOpen(true)}
        />
      </div>

      {isChangeGameModalOpen && (
        <Modal
          title={"Endre spill"}
          onClose={() => setIsChangeGameModalOpen(false)}
        >
          <GameInfo />
        </Modal>
      )}

      {isResetModalOpen && (
        <Modal
          title={"Nullstill spill"}
          onClose={() => setIsResetModalOpen(false)}
        >
          <div className="reset-game">
            <p>Dette sletter alle lag, poeng, kategorinavn og brukte ruter.</p>
            <button
              type="button"
              className="remove-button-style reset-game__confirm-button"
              onClick={resetGame}
            >
              Ja, nullstill
            </button>
          </div>
        </Modal>
      )}
    </header>
  );

  function resetGame() {
    setTeams([]);
    resetBoard();
    setIsResetModalOpen(false);
  }
}
