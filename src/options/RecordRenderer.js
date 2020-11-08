// @flow

import React from "react";
import AbstractRenderer from "./AbstractRenderer";
import type { RecordOption } from "../types/types";

type Props = {
  options: RecordOption,
  onNavigate: any,
  onChange: any,
  depth: number
};

/**
 * Renders a bunch of records (label, value pairs) as an unordered list.
 * If the item is a nested list or nested records, then a button
 * with the number of items in the nested object is displayed instead
 * that the user can click/navigate into.
 */
const RecordRenderer = ({ options, onNavigate, onChange, depth }: Props) => {
  const fieldCount = options.fields.length;

  return (
    <>
      {depth === options.path.length ? (
        <ol>
          {options.fields.map(field => {
            const option = field.value;
            return (
              <li key={field.value.path.join(".")}>
                <label>{field.label}</label>
                <AbstractRenderer
                  key={option.path.join(".")}
                  options={option}
                  onChange={onChange}
                  onNavigate={onNavigate}
                  displayDepth={depth}
                />
              </li>
            );
          })}
        </ol>
      ) : (
        <button
          style={{ display: "inline-block" }}
          onClick={() =>
            onNavigate(currPath => [...currPath, ...options.path.slice(-1)])
          }
          disabled={fieldCount === 0}
        >
          {fieldCount} record{fieldCount === 1 ? "" : "s"}
        </button>
      )}
    </>
  );
};

export default RecordRenderer;
