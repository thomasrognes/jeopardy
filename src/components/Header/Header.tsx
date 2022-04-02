import React, { useState } from "react";

import "./Header.scss";
import { Modal } from "../Modal/Modal";
import { MenuButton } from "../MenuButton/MenuButton";
import { GameInfo } from "../GameInfo/GameInfo";

export function Header() {
  const [isChangeGameModalOpen, setIsChangeGameModalOpen] = useState(false);

  return (
    <header className="header">
      <MenuButton
        title={"Velg spill"}
        onClick={() => setIsChangeGameModalOpen(true)}
      />

      {isChangeGameModalOpen && (
        <Modal
          title={"Endre spill"}
          hidden={false}
          onDialogToggle={() =>
            setIsChangeGameModalOpen(!isChangeGameModalOpen)
          }
        >
          <GameInfo />
        </Modal>
      )}
    </header>
  );
}
