import React from "react";

import config from "./config";
import useCanvasLayers from "./useCanvasLayers";

import "./reset.css";

const Canvas = () => {
  const layers = useCanvasLayers(config);
  return layers.map(
    ({ Component, id, x, y, width, height, scale, options }) => (
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
        <Component width={width} height={height} options={options} />
      </div>
    )
  );
};

export default Canvas;
