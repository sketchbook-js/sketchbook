import React from "react";

const AlignHorizontalMiddle = ({ color = "#000" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill={color}
    style={{ display: "block" }}
  >
    <path d="M7 1h1v13H7zM2 3h11v3H2zM5 9h5v3H5z" />
  </svg>
);

export default AlignHorizontalMiddle;
