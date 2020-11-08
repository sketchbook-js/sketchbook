import React from "react";
import RecordRenderer from "./RecordRenderer";
import StringRenderer from "./StringRenderer";
import ListRenderer from "./ListRenderer";
import PlainTextRenderer from "./PlainTextRenderer";

import type { Option } from "../types/types";

type Props = {
  options: Option,
  onChange: any,
  onNavigate: any,
  displayDepth: number
};

/**
 * Selects a renderer to display.
 */
const AbstractRenderer = ({
  options,
  onChange,
  onNavigate,
  displayDepth
}: Props) => {
  switch (options.type) {
    case "List":
      return (
        <ListRenderer
          options={options}
          onChange={onChange}
          onNavigate={onNavigate}
          depth={displayDepth}
        />
      );
    case "Record":
      return (
        <RecordRenderer
          options={options}
          onChange={onChange}
          onNavigate={onNavigate}
          depth={displayDepth}
        />
      );
    case "String":
      return <StringRenderer option={options} onChange={onChange} />;
    case "PlainText":
      return <PlainTextRenderer option={options} onChange={onChange} />;
    // etc
    default:
      throw Error(`Unknown option: ${options.type}`);
  }
};

export default AbstractRenderer;
