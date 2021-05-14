import React from "react";

import "./Modal.css";

export function Modal(props) {
  const { title, children, isOpen, setIsOpen, onCompleteClick } = props;

  const className = require("classnames");
  const classNamesForModal = className({
    modal: true,
    "modal-is-open": isOpen,
    "modal-is-closed": !isOpen,
  });

  return (
    <div className={classNamesForModal}>
      <div className="modal-content">
        <div className="modal-header">
          <h1>{title}</h1>
          <button onClick={() => setIsOpen(false)} className={"close"}>
            &times;
          </button>
        </div>
        <div>{children}</div>
        <button className="modal-complete-button" onClick={onCompleteClick}>
          Fullfør
        </button>
      </div>
    </div>
  );
}
