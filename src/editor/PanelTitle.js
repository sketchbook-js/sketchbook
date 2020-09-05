// @flow

import React from "react";

import type { Node } from "react";

type Props = {
  style: { marginTop?: number | string },
  children: Node
};

const PanelTitle = ({ style, children }: Props): Node => (
  <h2
    style={{
      color: "#000",
      fontWeight: "bold",
      fontSize: 14,
      fontVariantCaps: "small-caps",
      padding: "0 6px",
      borderBottom: "1px solid #ddd",
      ...style
    }}
  >
    {children}
  </h2>
);

export default PanelTitle;
