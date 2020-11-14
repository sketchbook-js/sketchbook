// @flow

import React from "react";
import type { ListOption } from "../types/types";
import AbstractRenderer from "./AbstractRenderer";

type Props = {
  options: ListOption,
  updateNode: any,
  onNavigate: any,
  depth: number
};

/**
 * Renders a list of items as an unordered list.
 * If the item is a nested list or nested records, then a button
 * with the number of items in the nested object is displayed instead
 * that the user can click/navigate into.
 */
const ListRenderer = ({ options, onNavigate, depth, updateNode }: Props) => {
  const listItemCount = options.items.length;
  return (
    <>
      {depth === options.path.length ? (
        <ol>
          {options.items.map(option => {
            const lastPath = option.path[option.path.length - 1];
            return (
              <li key={option.path.join(".")}>
                <AbstractRenderer
                  options={option}
                  updateNode={updater => {
                    updateNode(stateTree => {
                      return stateTree.map((value, i) => {
                        return i === lastPath ? updater(value) : value;
                      });
                      //  {
                      //   ...stateTree,
                      //   [String(path[0])]: updater(stateTree[String(path[0])])
                      // };
                    });
                  }}
                  onNavigate={onNavigate}
                  displayDepth={depth}
                />
              </li>
            );
          })}
        </ol>
      ) : (
        <button
          key={options.path.join(".")}
          style={{ display: "inline-block" }}
          onClick={() =>
            onNavigate(currPath => [...currPath, ...options.path.slice(-1)])
          }
          disabled={listItemCount === 0}
        >
          {listItemCount} list item{listItemCount === 1 ? "" : "s"}
        </button>
      )}
    </>
  );
};

export default ListRenderer;
