import React from "react";
import RecordRenderer from "./RecordRenderer";
import StringRenderer from "./StringRenderer";
import ListRenderer from "./ListRenderer";
import PlainTextRenderer from "./PlainTextRenderer";

import type { Option } from "../types/types";

type Props = {
  options: Option,
  updateNode: any,
  onNavigate: any,
  displayDepth: number
};

/**
 * Selects a renderer to display.
 */
const AbstractRenderer = ({
  options,
  updateNode,
  onNavigate,
  displayDepth
}: Props) => {
  switch (options.type) {
    case "List":
      return (
        <ListRenderer
          options={options}
          onNavigate={onNavigate}
          updateNode={updateNode}
          depth={displayDepth}
        />
      );
    case "Record":
      return (
        <RecordRenderer
          updateNode={updateNode}
          options={options}
          onNavigate={onNavigate}
          depth={displayDepth}
        />
      );
    case "String":
      return <StringRenderer option={options} updateNode={updateNode} />;
    case "PlainText":
      return <PlainTextRenderer option={options} updateNode={updateNode} />;
    // etc
    default:
      throw Error(`Unknown option: ${options.type}`);
  }
};

export default AbstractRenderer;
