import React from "react";

const config = {
  "Primitives / Heading 1": {
    component: ({ width, height, options: { text } }) => (
      <h1 style={{ width, height }}>{text}</h1>
    ),
    options: [
      {
        key: "text",
        input: "short-string",
        default: () => "Lorem ipsum"
      }
    ],
    defaultWidth: 480,
    defaultHeight: 50
  },
  "Primitives / Heading 2": {
    component: ({ width, height, options: { text } }) => (
      <h2 style={{ width, height }}>{text}</h2>
    ),
    options: [
      {
        key: "text",
        input: "short-string",
        default: () => "Lorem ipsum"
      }
    ],
    defaultWidth: 480,
    defaultHeight: 50
  },
  "Primitives / Paragraph": {
    component: ({ width, height, options: { text } }) => (
      <p style={{ width, height }}>{text}</p>
    ),
    options: [
      {
        key: "text",
        input: "short-string",
        default: () => "Lorem ipsum"
      }
    ],
    defaultWidth: 480,
    defaultHeight: 50
  },
  "Primitives / Header": {
    component: ({ width, height }) => (
      <header style={{ background: "#eef", width, height }}>Header</header>
    ),
    defaultWidth: 480,
    defaultHeight: 100
  }
};

export default config;
