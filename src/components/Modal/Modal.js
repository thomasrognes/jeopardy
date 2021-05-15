import React from "react";
import ReactDOM from "react-dom";
import CoreDialog from "@nrk/core-dialog/jsx";

import "./Modal.css";
import { CrossIcon } from "../crossIcon/CrossIcon";

export function Modal(props) {
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
