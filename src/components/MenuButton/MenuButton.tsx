import React from "react";
import "./MenuButton.scss";

interface Props {
  title: string;
  onClick: () => void;
  className?: string;
}

export function MenuButton(props: Props) {
  const { title, onClick, className } = props;

  return (
    <button className={`remove-button-style menu-button ${className}`} onClick={onClick}>
      {title}
    </button>
  );
}
