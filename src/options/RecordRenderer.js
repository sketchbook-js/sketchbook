// @flow

import React from "react";
import AbstractRenderer from "./AbstractRenderer";
import type { RecordOption } from "../types/types";

type Props = {
  options: RecordOption,
  onNavigate: any,
  updateNode: any,
  depth: number
};

/**
 * Renders a bunch of records (label, value pairs) as an unordered list.
 * If the item is a nested list or nested records, then a button
 * with the number of items in the nested object is displayed instead
 * that the user can click/navigate into.
 */
const RecordRenderer = ({ options, onNavigate, updateNode, depth }: Props) => {
  const fieldCount = options.fields.length;

  return (
    <>
      {depth === options.path.length ? (
        <ol>
          {options.fields.map(field => {
            console.log("label", field.label);
            const option = field.value;
            return (
              <li key={field.value.path.join(".")}>
                <label>{field.label}</label>
                <AbstractRenderer
                  key={option.path.join(".")}
                  options={option}
                  updateNode={updater => {
                    updateNode(stateTree => {
                      const lastPath = option.path[option.path.length - 1];
                      return {
                        ...stateTree,
                        [String(lastPath)]: updater(stateTree[String(lastPath)])
                      };
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

// const updateNodeHandler = option => updater => {
//   updateNode(current => {
//     const optionKey = option.path[option.path.length - 1];
//     const parentOptionKey = option.path[option.path.length - 2];
//     console.log("parentOptionKey", parentOptionKey);
//     console.log("opt", option);
//     console.log("optionKey", optionKey);
//     console.log("update", {
//       ...current[String(optionKey)],
//       [optionKey]: updater(current.optionKey)
//     });
//     if (typeof optionKey === "string") {
//       return option.type === "Record"
//         ? {
//             ...current,
//             [String(optionKey)]: updater({
//               ...current[String(optionKey)],
//               [optionKey]: updater(current.optionKey)
//             })
//           }
//         : updater(current[optionKey]);
//     }

//     if (typeof optionKey === "number") {
//       // List -> list.
//       console.log("here", current);
//       if (typeof parentOptionKey === "number") {
//         return { ...current };
//         // return {
//         //   ...current,
//         //   [String(parentOptionKey)]: current[parentOptionKey].map(
//         //     (value, i) => {
//         //       return i === optionKey ? updater(value) : value;
//         //     }
//         //   )
//         // };
//       }

//       // Record -> List
//       if (typeof parentOptionKey === "string") {
//         return {
//           ...current,
//           [String(parentOptionKey)]: current[parentOptionKey].map(
//             (value, i) => {
//               return i === optionKey ? updater(value) : value;
//             }
//           )
//         };
//       }
//     }
//     // console.log("current", current, field.label);
//     // return {
//     //   ...current,
//     //   [String(optionValue)]: option.type === "List" ?  :
//     //     updater(current[optionValue])
//     //   // children: current.children.map((child, i) => {
//     //   //   console.log("uc", updater(child));
//     //   //   return i === index ? updater(child) : child;
//     //   // })
//     // };
//   });
// };

export default RecordRenderer;
