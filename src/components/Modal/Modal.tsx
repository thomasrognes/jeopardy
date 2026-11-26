import React, { useId, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import "./Modal.scss";
import { CrossIcon } from "../crossIcon/CrossIcon";

interface Props {
  title: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  // Fyller hele skjermen og har en tilbakeknapp i stedet for kryss.
  fullscreen?: boolean;
}

export function Modal(props: Props) {
  const { title, onClose, children, fullscreen = false } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Layout effect, slik at close() kjører mens dialogen fortsatt ligger i
  // DOM-en. Da flytter nettleseren fokus tilbake dit det var.
  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={classNames("app-modal", {
        "app-modal--fullscreen": fullscreen,
      })}
      aria-labelledby={titleId}
      onClose={() => {
        // close-hendelsen kommer asynkront. Strict Mode lukker og åpner
        // dialogen på nytt, og da skal den forbli åpen.
        if (!dialogRef.current?.open) {
          onClose();
        }
      }}
    >
      {/* Står først, så den får fokus: et ekstra Enter-trykk går tilbake. */}
      {fullscreen && (
        <button
          type="button"
          onClick={onClose}
          className="button app-modal__back-button"
        >
          <span aria-hidden="true">←&nbsp;</span>Tilbake til brettet
        </button>
      )}
      <h2 id={titleId} className="app-modal__title">
        {title}
      </h2>
      {children}
      {!fullscreen && (
        <button
          type="button"
          onClick={onClose}
          className="app-modal__close-button"
          aria-label="Lukk"
        >
          <CrossIcon />
        </button>
      )}
    </dialog>,
    document.body
  );
}
