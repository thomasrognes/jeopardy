import React from "react";

export function PlusIcon(props) {
  const widthHeight = props.variant === "SMALL" ? 12 : 16;
  return (
    <svg className={props.className} width={widthHeight} height={widthHeight}>
      <use
        xlinkHref={props.variant === "SMALL" ? "#small-plus" : "#big-plus"}
      />
    </svg>
  );
}
