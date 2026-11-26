import React from "react";

import "./HowToPlay.scss";
import { Modal } from "../Modal/Modal";

interface Props {
  onClose: () => void;
}

export function HowToPlay(props: Props) {
  return (
    <Modal title="Slik spiller du" onClose={props.onClose}>
      <ol className="how-to-play__steps">
        <li>
          <strong>Gjør klart.</strong> Velg et spill, skriv inn kategoriene og
          legg til lagene.
        </li>
        <li>
          <strong>Velg en rute.</strong> Trykk på en poengsum under en av
          kategoriene.
        </li>
        <li>
          <strong>Gi poeng.</strong> Trykk på laget som svarte riktig, eller på
          «Ingen svarte riktig».
        </li>
        <li>
          <strong>Rett opp feil.</strong> «Angre» nederst på brettet tar tilbake
          den siste ruten.
        </li>
        <li>
          <strong>Kår vinneren.</strong> Vinneren vises når alle rutene er
          brukt. Vil dere avslutte før, velger dere «Avslutt og kår vinner» i
          menyen.
        </li>
      </ol>
      <p className="muted">
        Spilleder styrer musikken fra spillelisten og sjekker svarene i fasiten.
        Ikke vis fasiten til lagene.
      </p>
    </Modal>
  );
}
