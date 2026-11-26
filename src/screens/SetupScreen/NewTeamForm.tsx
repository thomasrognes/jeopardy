import React, { useId, useRef, useState } from "react";
import { teamNameError } from "../../game/teams";
import { useTeamActions } from "../../hooks/teamActionHooks";

interface Props {
  takenNames: string[];
}

export function NewTeamForm(props: Props) {
  const { takenNames } = props;
  const { addTeam } = useTeamActions();
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  return (
    <form
      className="new-team"
      onSubmit={(e) => {
        e.preventDefault();
        const error = teamNameError(name, takenNames);
        setErrorMessage(error);
        if (!error) {
          addTeam(name.trim());
          setName("");
        }
        // Klart for neste lag.
        inputRef.current?.focus();
      }}
    >
      <input
        ref={inputRef}
        type="text"
        className="text-field new-team__input"
        aria-label="Navn på nytt lag"
        aria-invalid={errorMessage !== ""}
        aria-describedby={errorMessage ? errorId : undefined}
        placeholder="Navn på nytt lag"
        autoComplete="off"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setErrorMessage("");
        }}
      />
      <button type="submit" className="button button--secondary">
        Legg til
      </button>
      {errorMessage && (
        <p id={errorId} className="error new-team__error">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
