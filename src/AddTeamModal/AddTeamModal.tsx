import React, { useState } from "react";
import { Modal } from "../components/Modal/Modal";
import { useAllTeam } from "../hooks/teamHooks";
import { TextField } from "@material-ui/core";

import "./AddTeamModal.scss";

interface Props {
  setIsModalOpen: (b: boolean) => void;
  isModalOpen: boolean;
}

export function AddTeamModal(props: Props) {
  const { setIsModalOpen, isModalOpen } = props;
  const { teams, setTeams } = useAllTeam();
  const [teamName, setTeamName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Modal
      title={"Legg til nytt lag"}
      hidden={false}
      onDialogToggle={() => setIsModalOpen(!isModalOpen)}
    >
      <form className="add-team-modal" onSubmit={(e) => e.preventDefault()}>
        <TextField
          label="Lagnavn"
          variant="standard"
          size={"medium"}
          fullWidth
          required
          error={errorMessage !== ""}
          inputProps={{ style: { fontSize: 20 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }} // font size of input label
          onChange={(e) => {
            setTeamName(e.target.value);
            setErrorMessage("");
          }}
        />
      </form>
      <button
        className="remove-button-style add-team-modal__complete-button"
        onClick={onCompleteClick}
      >
        Fullfør
      </button>
    </Modal>
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
