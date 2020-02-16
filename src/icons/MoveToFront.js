import React from "react";

const MoveToFront = ({ color = "#000" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    style={{ display: "block" }}
  >
    <path stroke={color} d="M7.5 6.5h5v2h-5zM7.5 10.5h5v2h-5z" />
    <path fill={color} d="M1.5 5l2-2 2 2H4v8H3V5H1.5zM7 2h6v3H7z" />
  </svg>
);

export default MoveToFront;
