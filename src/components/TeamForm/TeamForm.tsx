import React, { useId, useState } from "react";

import "./TeamForm.scss";

interface Props {
  initialName?: string;
  // Navn som allerede er i bruk av andre lag.
  takenNames: string[];
  submitLabel: string;
  onSubmit: (name: string) => void;
  // Ekstra knapp til venstre for lagreknappen. Må ha type="button".
  secondaryAction?: React.ReactNode;
}

export function TeamForm(props: Props) {
  const {
    initialName = "",
    takenNames,
    submitLabel,
    onSubmit,
    secondaryAction,
  } = props;
  const [teamName, setTeamName] = useState(initialName);
  const [errorMessage, setErrorMessage] = useState("");
  const inputId = useId();
  const errorId = useId();

  return (
    // noValidate: vi viser egne feilmeldinger.
    <form className="team-form" onSubmit={handleSubmit} noValidate>
      <div className="team-form__field">
        <label className="team-form__label" htmlFor={inputId}>
          Lagnavn<span aria-hidden="true"> *</span>
        </label>
        <input
          id={inputId}
          className="team-form__input"
          type="text"
          autoComplete="off"
          // Gir feltet fokus også når skjemaet vises igjen i en åpen dialog.
          autoFocus
          required
          value={teamName}
          aria-invalid={errorMessage !== ""}
          aria-describedby={errorMessage ? errorId : undefined}
          onChange={(e) => {
            setTeamName(e.target.value);
            setErrorMessage("");
          }}
        />
        {errorMessage && (
          <span id={errorId} className="team-form__error">
            {errorMessage}
          </span>
        )}
      </div>
      <div className="team-form__actions">
        {secondaryAction}
        <button type="submit" className="pill-button pill-button--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const name = teamName.trim();

    if (name === "") {
      setErrorMessage("Lagnavn kan ikke være tomt.");
      return;
    }
    const isNameTaken = takenNames.some(
      (taken) => taken.toLowerCase() === name.toLowerCase()
    );
    if (isNameTaken) {
      setErrorMessage("Det finnes allerede et lag med det navnet.");
      return;
    }

    onSubmit(name);
  }
}
