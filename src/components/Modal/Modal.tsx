import React from "react";
import ReactDOM from "react-dom";
// @ts-ignore
import CoreDialog from "@nrk/core-dialog/jsx";

import "./Modal.css";
import { CrossIcon } from "../crossIcon/CrossIcon";

interface Props {
  title: string;
  hidden: boolean;
  onDialogToggle: () => void;
  children: React.ReactNode;
  strict?: boolean;
  classNameForModal?: string;
}

export function Modal(props: Props) {
  const {
    title,
    hidden,
    onDialogToggle,
    children,
    strict = false,
    classNameForModal,
  } = props;

  const classNames = require("classnames");
  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) {
    throw Error("Could not find he DOM element to render modal in.");
  }

  return ReactDOM.createPortal(
    <div className={classNames("modal", classNameForModal)}>
      <CoreDialog
        className="modal-content"
        hidden={hidden}
        strict={strict}
        backdrop={true}
        onDialogToggle={onDialogToggle}
      >
        <h3 className="modal-title">{title}</h3>
        {children}
        <button
          onClick={onDialogToggle}
          className="modal-close-button remove-button-style"
        >
          <CrossIcon />
        </button>
      </CoreDialog>
    </div>,
    modalRoot
  );
}
