// @flow

import React from "react";
import type { PlainTextOption } from "../types/types";

type Props = {
  option: PlainTextOption,
  updateNode: any
};

const PlainTextRenderer = ({ option, updateNode }: Props) => {
  return (
    <input
      type="text"
      value={option.value}
      onChange={({ target: { value } }) => {
        updateNode(stateTree => {
          return value;
        });
      }}
    />
  );
};

export default PlainTextRenderer;
