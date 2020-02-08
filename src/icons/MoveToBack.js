import React from "react";

const MoveToBack = ({ color = "#000" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    style={{ display: "block" }}
  >
    <path fill={color} d="M7 10h6v3H7zM3 2v8H1.5l2 2 2-2H4V2H3z" />
    <path stroke={color} d="M7.5 6.5h5v2h-5zM7.5 2.5h5v2h-5z" />
  </svg>
);

export default MoveToBack;
