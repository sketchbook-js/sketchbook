import React from "react";
import ReactDOM from "react-dom";

import Layer from "./Layer";
import useEditorConnection from "./useEditorConnection";

const defaultRender = ({ element, name, width, height }) => {
  element.style.background = "#eee";
  element.style.width = `${Math.round(width)}px`;
  element.style.height = `${Math.round(height)}px`;
  element.style.display = "flex";
  element.style.alignItems = "center";
  element.style.justifyContent = "center";
  element.innerText = name;
};

const Canvas = ({ config }) => {
  const {
    layersToRender,
    layersToMeasure,
    sendMeasurements
  } = useEditorConnection(window.top, window);
  return (
    <>
      <style jsx global>{`
        html,
        body,
        #root {
          height: 100%;
          margin: 0;
          overflow: hidden;
          padding: 0;
        }
      `}</style>
      {[
        ...layersToRender,
        ...layersToMeasure.map(layer => ({
          ...layer,
          x: 100_000,
          y: 100_000,
          scale: 1,
          onRender: ({ width, height }) => {
            sendMeasurements({ id: layer.id, width, height });
          }
        }))
      ]
        .map(layer => ({
          ...layer,
          render:
            config.components.find(({ type }) => type === layer.component)
              .render ?? defaultRender
        }))
        .map(
          ({
            id,
            type,
            name,
            render,
            x,
            y,
            scale,
            width,
            height,
            options,
            onRender
          }) => (
            <div
              key={id}
              style={{
                overflow: "hidden",
                position: "absolute",
                transform: `translate(${x}px, ${y}px) scale(${scale}, ${scale})`,
                width,
                height
              }}
            >
              <Layer
                id={id}
                type={type}
                name={name}
                width={width}
                height={height}
                options={options}
                render={render}
                onRender={onRender}
              />
            </div>
          )
        )}
    </>
  );
};

window.Sketchbook = {
  init: config => {
    config.initCanvas(document);
    ReactDOM.render(
      <Canvas config={config} />,
      document.getElementById("root")
    );
  }
};
