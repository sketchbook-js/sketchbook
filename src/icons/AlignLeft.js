import React from "react";

const AlignLeft = ({ color = "#000" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill={color}
    style={{ display: "block" }}
  >
    <path d="M1 1h1v13H1zM3 3h11v3H3zM3 9h5v3H3z" />
  </svg>
);

export default AlignLeft;
