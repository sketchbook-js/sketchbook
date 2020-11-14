// @flow

import React, { useState } from "react";

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

  console.log("doc", doc);

  // when multiple layers are selected, options can't be shown
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

  // no options in selected layer component
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

  const {
    options: displayOptions,
    depth: optionDepth,
    updateNode: updateNodeHandler
  } = resolvePath({
    options,
    path,
    depth,
    updateNode: updater => {
      setState(current => ({
        ...current,
        doc: {
          layers: current.doc.layers.map(layer =>
            layer.id === selectedLayer.id
              ? {
                  ...layer,
                  options: updater(layer.options)
                }
              : layer
          )
        }
      }));
    }
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
        updateNode={updateNodeHandler}
        // Used to determine how to render the list-like option types
        displayDepth={optionDepth}
      />
    </>
  );
};

export default OptionsPanel;
