import React from "react";

const MoveForward = ({ color = "#000" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    style={{ display: "block" }}
  >
    <path fill={color} d="M7 6h6v3H7zM1.5 9l2-2 2 2H4v4H3V9H1.5z" />
    <path stroke={color} d="M7.5 10.5h5v2h-5zM7.5 2.5h5v2h-5z" />
  </svg>
);

export default MoveForward;
