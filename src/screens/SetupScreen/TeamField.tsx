import React, { useId, useState } from "react";
import { teamNameError } from "../../game/teams";

interface Props {
  name: string;
  number: number;
  color: string;
  otherNames: string[];
  onRename: (name: string) => void;
  onRemove: () => void;
}

export function TeamField(props: Props) {
  const { name, number, color, otherNames, onRename, onRemove } = props;
  const [savedName, setSavedName] = useState(name);
  const [draft, setDraft] = useState(name);
  const [errorMessage, setErrorMessage] = useState("");
  const errorId = useId();

  // Raden kan få et annet lag, for eksempel når et lag over fjernes.
  if (name !== savedName) {
    setSavedName(name);
    setDraft(name);
    setErrorMessage("");
  }

  return (
    <li>
      <form
        className="team-field"
        style={{ borderLeftColor: color }}
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <input
          type="text"
          className="team-field__input"
          aria-label={`Navn på lag ${number}`}
          aria-invalid={errorMessage !== ""}
          aria-describedby={errorMessage ? errorId : undefined}
          autoComplete="off"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setErrorMessage(teamNameError(e.target.value, otherNames));
          }}
          onBlur={save}
        />
        <button
          type="button"
          className="team-field__remove"
          aria-label={`Fjern ${name}`}
          onClick={onRemove}
        >
          <span aria-hidden="true">×</span>
        </button>
      </form>
      {errorMessage && (
        <p id={errorId} className="error">
          {errorMessage}
        </p>
      )}
    </li>
  );

  // Et ugyldig navn forkastes, så laget alltid har et navn som kan brukes.
  function save() {
    const trimmed = draft.trim();

    if (teamNameError(trimmed, otherNames)) {
      setDraft(name);
    } else {
      setDraft(trimmed);
      if (trimmed !== name) {
        onRename(trimmed);
      }
    }
    setErrorMessage("");
  }
}
