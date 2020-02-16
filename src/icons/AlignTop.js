import React from "react";

const AlignTop = ({ color = "#000" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill={color}
    style={{ display: "block" }}
  >
    <path d="M1 1h13v1H1zM9 3h3v11H9zM3 3h3v5H3z" />
  </svg>
);

export default AlignTop;
