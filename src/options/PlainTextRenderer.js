// @flow

import React from "react";
import type { PlainTextOption } from "../types/types";

type Props = {
  option: PlainTextOption,
  onChange: any
};

const PlainTextRenderer = ({ option, onChange }: Props) => {
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

export default PlainTextRenderer;
