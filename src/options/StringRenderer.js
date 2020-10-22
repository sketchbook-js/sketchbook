// @flow

import React from "react";
import type { StringOption } from "../types/types";

type Props = {
  option: StringOption,
  onChange: any
};

const StringRenderer = ({ option, onChange }: Props) => {
  return (
    <input
      type="text"
      value={option.value}
      onChange={event => {
        onChange(event.currentTarget.value, option.path);
      }}
    />
  );
};

export default StringRenderer;
