import React, { useId, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

import "./Modal.scss";
import { CrossIcon } from "../crossIcon/CrossIcon";

interface Props {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal(props: Props) {
  const { title, onClose, children } = props;
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
      className="app-modal"
      aria-labelledby={titleId}
      onClose={() => {
        // close-hendelsen kommer asynkront. Strict Mode lukker og åpner
        // dialogen på nytt, og da skal den forbli åpen.
        if (!dialogRef.current?.open) {
          onClose();
        }
      }}
    >
      <h3 id={titleId} className="app-modal__title">
        {title}
      </h3>
      {children}
      <button
        type="button"
        onClick={onClose}
        className="app-modal__close-button remove-button-style"
        aria-label="Lukk"
      >
        <CrossIcon />
      </button>
    </dialog>,
    document.body
  );
}
