// @flow

import React from "react";
import StringRenderer from "./StringRenderer";
import type { ListOption } from "../types/types";
import PlainTextRenderer from "./PlainTextRenderer";

type Props = {
  options: ListOption,
  onChange: any,
  onNavigate: any,
  depth: number
};

const ListRenderer = ({ options, onChange, onNavigate, depth }: Props) => {
  return (
    <ol>
      {options.items.map(option => {
        switch (option.type) {
          case "List":
            const listItemCount = option.items.length;
            return (
              <button
                key={option.path.join(".")}
                style={{ display: "inline-block" }}
                onClick={() =>
                  onNavigate(currPath => [
                    ...currPath,
                    ...option.path.slice(-2)
                  ])
                }
                disabled={listItemCount === 0}
              >
                {listItemCount} list item{listItemCount === 1 ? "" : "s"}
              </button>
            );
          case "Record":
            const recordCount = option.fields.length;
            return (
              <button
                key={option.path.join(".")}
                style={{ display: "inline-block" }}
                onClick={() =>
                  onNavigate(currPath => [
                    ...currPath,
                    ...option.path.slice(-1)
                  ])
                }
                disabled={recordCount === 0}
              >
                {recordCount} record{recordCount === 1 ? "" : "s"}
              </button>
            );
          case "String":
            return (
              <StringRenderer
                key={option.path.join(".")}
                option={option}
                onChange={onChange}
              />
            );
          case "PlainText":
            return (
              <PlainTextRenderer
                key={option.path.join(".")}
                option={option}
                onChange={onChange}
              />
            );
          default:
            throw Error(`Unknown option: ${option.type}`);
        }
      })}
    </ol>
  );
};

export default ListRenderer;
