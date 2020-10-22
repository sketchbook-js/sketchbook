import React from "react";
import RecordRenderer from "./RecordRenderer";
import StringRenderer from "./StringRenderer";
import ListRenderer from "./ListRenderer";
import PlainTextRenderer from "./PlainTextRenderer";

/**
 * Selects a renderer to display.
 */
const AbstractRenderer = ({ options, onChange, onNavigate, depth = 0 }) => {
  switch (options.type) {
    case "List":
      return (
        <ListRenderer
          options={options}
          onChange={onChange}
          onNavigate={onNavigate}
          depth={depth}
        />
      );
    case "Record":
      return (
        <RecordRenderer
          options={options}
          onChange={onChange}
          onNavigate={onNavigate}
          depth={depth}
        />
      );
    case "String":
      return (
        <StringRenderer
          option={options}
          onChange={onChange}
          onNavigate={onNavigate}
        />
      );
    case "PlainText":
      return (
        <PlainTextRenderer
          option={options}
          onChange={onChange}
          onNavigate={onNavigate}
        />
      );
    // etc
    default:
      throw Error(`Unknown option: ${options.type}`);
  }
};

export default AbstractRenderer;
