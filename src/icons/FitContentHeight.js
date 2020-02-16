import React from "react";

const FitContentHeight = ({ color = "#000" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill={color}
    style={{ display: "block" }}
  >
    <path d="M1 1v7h6v2H5.5l2 2 2-2H8V8h6V1H1zM1 9h1v1H1zM1 11h1v1H1zM1 13h1v1H1zM3 13h1v1H3zM5 13h1v1H5zM7 13h1v1H7zM9 13h1v1H9zM11 13h1v1h-1zM13 13h1v1h-1zM13 11h1v1h-1zM13 9h1v1h-1z" />
  </svg>
);

export default FitContentHeight;
