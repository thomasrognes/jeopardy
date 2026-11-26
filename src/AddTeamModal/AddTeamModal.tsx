import React, { useId, useState } from "react";
import { Modal } from "../components/Modal/Modal";
import { useAllTeam } from "../hooks/teamHooks";

import "./AddTeamModal.scss";

interface Props {
  setIsModalOpen: (b: boolean) => void;
}

export function AddTeamModal(props: Props) {
  const { setIsModalOpen } = props;
  const { teams, setTeams } = useAllTeam();
  const [teamName, setTeamName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputId = useId();
  const errorId = useId();

  return (
    <Modal title={"Legg til nytt lag"} onClose={() => setIsModalOpen(false)}>
      {/* noValidate: vi viser egne feilmeldinger. */}
      <form className="add-team-modal" onSubmit={onSubmit} noValidate>
        <div className="add-team-modal__field">
          <label className="add-team-modal__label" htmlFor={inputId}>
            Lagnavn<span aria-hidden="true"> *</span>
          </label>
          <input
            id={inputId}
            className="add-team-modal__input"
            type="text"
            autoComplete="off"
            required
            aria-invalid={errorMessage !== ""}
            aria-describedby={errorMessage ? errorId : undefined}
            onChange={(e) => {
              setTeamName(e.target.value);
              setErrorMessage("");
            }}
          />
          {errorMessage && (
            <span id={errorId} className="add-team-modal__error">
              {errorMessage}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="pill-button pill-button--primary add-team-modal__complete-button"
        >
          Fullfør
        </button>
      </form>
    </Modal>
  );

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const name = teamName.trim();

    if (name === "") {
      setErrorMessage("Lagnavn kan ikke være tomt.");
      return;
    }
    const isNameTaken = teams.some(
      (team) => team.name.toLowerCase() === name.toLowerCase()
    );
    if (isNameTaken) {
      setErrorMessage("Det finnes allerede et lag med det navnet.");
      return;
    }

    setTeams([...teams, { name, score: 0 }]);
    setIsModalOpen(false);
  }
}
