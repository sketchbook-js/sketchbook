// @flow

import React, { useState } from "react";

import PanelTitle from "../editor/PanelTitle";
import RecordRenderer from "../options/RecordRenderer";

type Props = {
  selection: any,
  doc: any,
  config: any,
  setState: any
};

const OptionsPanel = ({ selection, doc, config, setState }: Props) => {
  const [path, setPath] = useState([]);
  const [depth, setDepth] = useState(0);
  return (
    <>
      <PanelTitle style={{ marginTop: 6 }}>Options</PanelTitle>
      {selection.size > 1 ? (
        <div
          style={{
            color: "#999",
            fontStyle: "italic",
            padding: 6
          }}
        >
          Multiple layers selected
        </div>
      ) : (
        (
          <>
            {/* RENDER PATH BAR */}
            {["Root", ...path].map(pathItem => {
              return (
                <button
                  className="path"
                  onClick={() => {
                    setPath(currPath => {
                      const keyIndex = currPath.findIndex(
                        path => path === pathItem
                      );
                      return currPath.length === 1
                        ? [] // Render the root level
                        : currPath.slice(0, keyIndex);
                    });
                  }}
                >
                  {pathItem}
                  {">"}
                  <style jsx>{`
                    .path:hover {
                      color: "pink";
                    }
                  `}</style>
                </button>
              );
            })}
            {/* BACK BUTTON */}
            <button
              onClick={() => {
                setPath(path => path.slice(0, path.length - 1));
              }}
            >
              Back
            </button>
            {config.components.find(
              ({ type }) =>
                doc.layers.find(({ id }) => id === [...selection][0])
                  .component === type
            ).options ? (
              <RecordRenderer
                newPaths={[]}
                fields={
                  config.components.find(
                    ({ type }) =>
                      doc.layers.find(({ id }) => id === [...selection][0])
                        .component === type
                  ).options
                }
                values={
                  // TODO: id === selected layer instead of 101010
                  doc.layers.find(({ id }) => id === [...selection][0]).options
                }
                path={path}
                depth={depth}
                onNavigate={newPaths => setPath(path => [...path, ...newPaths])}
                onChange={(index, key, value) =>
                  // TODO: This doesn't work because it requires you to update the state more than 1 layer. IT also has to be able to handle key value objects and arrays.
                  // Pass in an index when wanting to modify an array element, otherwise pass in null.
                  setState(current => ({
                    ...current,
                    doc: {
                      layers: current.doc.layers.map(layer =>
                        layer.id === [...selection][0]
                          ? {
                              ...layer,
                              options: {
                                ...layer.options,
                                [key]:
                                  index === null
                                    ? value
                                    : layer.options.key.map((keyValue, i) =>
                                        i === index ? value : keyValue
                                      )
                              }
                            }
                          : layer
                      )
                    }
                  }))
                }
              />
            ) : null}
          </>
        ) ?? (
          <div
            style={{
              color: "#999",
              fontStyle: "italic",
              padding: 6
            }}
          >
            No options
          </div>
        )
      )}
    </>
  );
};

export default OptionsPanel;
