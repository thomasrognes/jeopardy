import React, { useState } from "react";

import "./Header.scss";
import { Modal } from "../Modal/Modal";
import { MenuButton } from "../MenuButton/MenuButton";
import { GameInfo } from "../GameInfo/GameInfo";
import { useAllTeam } from "../../hooks/teamHooks";
import { useBoard } from "../../hooks/boardHooks";
import { UndoButton } from "../UndoButton/UndoButton";

export function Header() {
  const [isChangeGameModalOpen, setIsChangeGameModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { setTeams } = useAllTeam();
  const { resetBoard } = useBoard();

  return (
    <header className="header">
      <h1 className="header__title">Jeopardy</h1>
      <div className="header__buttons">
        <MenuButton
          title={"Velg spill"}
          onClick={() => setIsChangeGameModalOpen(true)}
        />
        <MenuButton
          title={"Nullstill spill"}
          onClick={() => setIsResetModalOpen(true)}
        />
        <UndoButton />
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
            <div className="reset-game__actions">
              {/* Dialogen gir fokus til første knapp. Det skal være Avbryt. */}
              <button
                type="button"
                className="pill-button pill-button--secondary"
                onClick={() => setIsResetModalOpen(false)}
              >
                Avbryt
              </button>
              <button
                type="button"
                className="pill-button pill-button--danger"
                onClick={resetGame}
              >
                Ja, nullstill
              </button>
            </div>
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
