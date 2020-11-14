// @flow

import React from "react";
import type { StringOption } from "../types/types";

type Props = {
  option: StringOption,
  updateNode: any
};

const StringRenderer = ({ option, updateNode }: Props) => {
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

export default StringRenderer;
