import React from "react";

const config = {
  Heading1: {
    component: ({ children }) => <h1>{children}</h1>,
    defaultWidth: 480,
    defaultHeight: 50
  },
  Heading2: {
    component: ({ children }) => <h2>{children}</h2>,
    defaultWidth: 480,
    defaultHeight: 50
  },
  Paragraph: {
    component: ({ children }) => <p>{children}</p>,
    defaultWidth: 480,
    defaultHeight: 50
  },
  Header: {
    component: () => <header style={{ background: "#eef" }}>Header</header>,
    defaultWidth: 480,
    defaultHeight: 100
  }
};

export default config;
