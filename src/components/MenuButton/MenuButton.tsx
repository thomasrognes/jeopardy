import React from "react";
import "./MenuButton.scss";
import classNames from "classnames";

interface Props {
  title: string;
  onClick: () => void;
  className?: string;
}

export function MenuButton(props: Props) {
  const { title, onClick, className } = props;

  return (
    <button
      className={classNames("pill-button menu-button", className)}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
