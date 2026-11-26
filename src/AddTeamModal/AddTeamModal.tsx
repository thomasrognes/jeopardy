import React from "react";
import { Modal } from "../components/Modal/Modal";
import { TeamForm } from "../components/TeamForm/TeamForm";
import { useAllTeam } from "../hooks/teamHooks";

interface Props {
  setIsModalOpen: (b: boolean) => void;
}

export function AddTeamModal(props: Props) {
  const { setIsModalOpen } = props;
  const { teams, setTeams } = useAllTeam();

  return (
    <Modal title={"Legg til nytt lag"} onClose={() => setIsModalOpen(false)}>
      <TeamForm
        takenNames={teams.map((team) => team.name)}
        submitLabel="Fullfør"
        onSubmit={(name) => {
          setTeams([...teams, { name, score: 0 }]);
          setIsModalOpen(false);
        }}
      />
    </Modal>
  );
}
