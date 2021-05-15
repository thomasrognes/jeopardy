import React from "react";

import "./CrossIcon.css";

export function CrossIcon() {
  return (
    <svg viewBox="0 0 10 10" className="cross-icon">
      <line
        x1="0"
        y1="10"
        x2="10"
        y2="0"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="0"
        y1="0"
        x2="10"
        y2="10"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
