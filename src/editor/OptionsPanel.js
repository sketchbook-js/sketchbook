// @flow

import React, { useState } from "react";
import * as immutable from "object-path-immutable";

import PanelTitle from "../editor/PanelTitle";
import AbstractRenderer from "../options/AbstractRenderer";
import reconcileOptions from "../options/reconcileOptions";
import resolvePath from "../options/resolvePath";

type Props = {
  selection: any,
  doc: any,
  config: any,
  setState: any
};

const OptionsPanel = ({ selection, doc, config, setState }: Props) => {
  const [path, setPath] = useState([]);
  const [depth, setDepth] = useState(0);

  if (selection.size > 1) {
    return (
      <>
        <PanelTitle style={{ marginTop: 6 }}>Options</PanelTitle>
        <div
          style={{
            color: "#999",
            fontStyle: "italic",
            padding: 6
          }}
        >
          Multiple layers selected
        </div>
      </>
    );
  }

  const selectedLayerIndex = doc.layers.findIndex(
    ({ id }) => id === [...selection][0]
  );
  const selectedLayer = doc.layers[selectedLayerIndex];
  const selectedLayerComponent = config.components.find(
    ({ type }) => selectedLayer.component === type
  );

  if (!selectedLayerComponent.options) {
    return (
      <>
        <PanelTitle style={{ marginTop: 6 }}>Options</PanelTitle>
        <div
          style={{
            color: "#999",
            fontStyle: "italic",
            padding: 6
          }}
        >
          No options
        </div>
      </>
    );
  }

  const options = reconcileOptions(
    { type: "Record", fields: selectedLayerComponent.options },
    selectedLayer.options
  );

  const { options: displayOptions, depth: displayOptionsDepth } = resolvePath({
    options,
    path,
    depth
  });

  return (
    <>
      <PanelTitle style={{ marginTop: 6 }}>Options</PanelTitle>
      {/* PATH NAVBAR */}
      {["Root", ...path].map((pathItem, i) => {
        return (
          <button
            key={path.slice(i).join(".")}
            className="path"
            onClick={() => {
              setPath(currPath => {
                if (pathItem === "Root" && currPath.length === 0) {
                  return []; // Render root level
                }

                const keyIndex = currPath.findIndex(
                  pathName => pathName === pathItem
                );
                return currPath.slice(0, keyIndex + 1);
              });
            }}
          >
            {pathItem}
            {/* Don't render the ">" for the last path element. */}
            {path.length === i ? "" : ">"}
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
          setPath(currPath => currPath.slice(0, currPath.length - 1));
        }}
        // DISABLE WHEN ONLY ROOT
        disabled={path.length === 0}
      >
        Back
      </button>

      {/* Options */}
      <AbstractRenderer
        options={displayOptions}
        // update doc path
        onNavigate={newPath => setPath(newPath)}
        // used to immutably update nested object state of unknown depth
        onChange={(newValue, rendererPath) => {
          // rendererPath is formatted like path1.path2.path3 etc.
          const formattedPath =
            `doc.layers.${selectedLayerIndex}.options.` +
            rendererPath.join(".");
          return setState(currState => {
            return immutable.set(currState, formattedPath, newValue);
          });
        }}
        depth={displayOptionsDepth}
      />
    </>
  );
};

export default OptionsPanel;
