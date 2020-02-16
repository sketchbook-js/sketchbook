import React from "react";

const FitContentWidth = ({ color = "#000" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill={color}
    style={{ display: "block" }}
  >
    <path d="M1 1v13h7V8h2v1.5l2-2-2-2V7H8V1H1zM9 13h1v1H9zM11 13h1v1h-1zM13 13h1v1h-1zM13 7h1v1h-1zM13 11h1v1h-1zM13 5h1v1h-1zM13 9h1v1h-1zM13 3h1v1h-1zM13 1h1v1h-1zM11 1h1v1h-1zM9 1h1v1H9z" />
  </svg>
);

export default FitContentWidth;
