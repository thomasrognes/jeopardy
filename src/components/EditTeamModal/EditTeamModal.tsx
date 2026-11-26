import React, { useState } from "react";

import "./EditTeamModal.scss";
import { useAllTeam } from "../../hooks/teamHooks";
import { useTeamActions } from "../../hooks/teamActionHooks";
import { Modal } from "../Modal/Modal";
import { TeamForm } from "../TeamForm/TeamForm";

interface Props {
  teamName: string;
  onClose: () => void;
}

export function EditTeamModal(props: Props) {
  const { teamName, onClose } = props;
  const { teams } = useAllTeam();
  const { renameTeam, removeTeam } = useTeamActions();
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false);

  return (
    <Modal
      title={isConfirmingRemoval ? "Fjern lag" : "Rediger lag"}
      onClose={onClose}
    >
      {isConfirmingRemoval ? (
        <div className="remove-team">
          <p>Vil du fjerne «{teamName}»? Laget og poengene slettes.</p>
          <div className="remove-team__actions">
            {/* Fokus på Avbryt, så et ekstra Enter-trykk ikke sletter laget. */}
            <button
              type="button"
              className="pill-button pill-button--secondary"
              onClick={() => setIsConfirmingRemoval(false)}
              autoFocus
            >
              Avbryt
            </button>
            <button
              type="button"
              className="pill-button pill-button--danger"
              onClick={() => {
                removeTeam(teamName);
                onClose();
              }}
            >
              Ja, fjern
            </button>
          </div>
        </div>
      ) : (
        <TeamForm
          initialName={teamName}
          takenNames={teams
            .map((team) => team.name)
            .filter((name) => name !== teamName)}
          submitLabel="Lagre"
          onSubmit={(name) => {
            renameTeam(teamName, name);
            onClose();
          }}
          secondaryAction={
            <button
              type="button"
              className="pill-button pill-button--secondary"
              onClick={() => setIsConfirmingRemoval(true)}
            >
              Fjern lag
            </button>
          }
        />
      )}
    </Modal>
  );
}
