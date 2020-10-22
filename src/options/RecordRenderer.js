// @flow

import React from "react";
import StringRenderer from "./StringRenderer";
import type { RecordOption, Option } from "../types/types";
import PlainTextRenderer from "./PlainTextRenderer";

type Props = {
  options: RecordOption,
  onNavigate: any,
  onChange: any
};

/**
 * Renders a bunch of records (label, value pairs) as an unordered list.
 * If the item is a nested list or nested records, then a button
 * with the number of items in the nested object is displayed instead
 * that the user can click/navigate into.
 */
const RecordRenderer = ({ options, onNavigate, onChange }: Props) => {
  return (
    <ol>
      {options.fields.map(field => {
        return (
          <li key={field.value.path.join(".")}>
            <label>{field.label}</label>
            <RecordValue
              onChange={onChange}
              onNavigate={onNavigate}
              option={field.value}
            />
          </li>
        );
      })}
    </ol>
  );
};

const RecordValue = ({
  option,
  onChange,
  onNavigate
}: {
  option: Option,
  onNavigate: any,
  onChange: any
}) => {
  switch (option.type) {
    case "Record":
      const fieldCount = option.fields.length;
      return (
        <button
          style={{ display: "inline-block" }}
          onClick={() =>
            onNavigate(currPath => [...currPath, ...option.path.slice(-1)])
          }
          disabled={fieldCount === 0}
        >
          {fieldCount} record{fieldCount === 1 ? "" : "s"}
        </button>
      );
    case "List":
      const listItemCount = option.items.length;
      return (
        <button
          style={{ display: "inline-block" }}
          onClick={() =>
            onNavigate(currPath => [...currPath, ...option.path.slice(-1)])
          }
          disabled={listItemCount === 0}
        >
          {listItemCount} list item{listItemCount === 1 ? "" : "s"}
        </button>
      );
    case "String":
      return <StringRenderer option={option} onChange={onChange} />;
    case "PlainText":
      return <PlainTextRenderer option={option} onChange={onChange} />;
    default:
      throw Error(`Unknown option: ${option.type}`);
  }
};

export default RecordRenderer;
