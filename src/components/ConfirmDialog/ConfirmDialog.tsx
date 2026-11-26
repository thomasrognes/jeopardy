import React from "react";

import "./ConfirmDialog.scss";
import { Modal } from "../Modal/Modal";

interface Props {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog(props: Props) {
  const { title, message, confirmLabel, onConfirm, onCancel } = props;

  return (
    <Modal title={title} onClose={onCancel}>
      <p className="confirm__message">{message}</p>
      <div className="confirm__actions">
        {/* Dialogen gir fokus til første knapp. Det skal være Avbryt. */}
        <button
          type="button"
          className="button button--outline"
          onClick={onCancel}
        >
          Avbryt
        </button>
        <button
          type="button"
          className="button button--danger"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
