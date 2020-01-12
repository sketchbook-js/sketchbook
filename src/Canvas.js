import React, { useState, useEffect } from "react";
import { set } from "set-fns";

import config from "./config";

import "./reset.css";

const Canvas = () => {
  const [doc, setDoc] = useState({
    layers: []
  });
  const [view, setView] = useState({
    selection: set([]),
    transform: {
      x: 0,
      y: 0,
      scale: 1
    },
    width: 0,
    height: 0,
    mouse: {}
  });
  useEffect(() => {
    const receiveMessage = event => {
      if (event.data.type && event.data.type === "update_canvas") {
        setDoc(event.data.doc);
        setView(event.data.view);
      }
    };
    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [setDoc, setView]);
  return (
    <div
      style={{
        background: "#f0f",
        display: "block",
        position: "relative",
        transform: `translate(${view.transform.x}px, ${view.transform.y}px) scale(${view.transform.scale})`
      }}
      onClick={() => {
        setView(current => ({ ...current, selection: set([]) }));
      }}
    >
      {doc.layers.map(({ id, component, x1, y1, x2, y2, options }) => {
        if (!config[component]) throw Error(`Unknown type ${component}`);
        const Component = config[component].component;
        return (
          <div
            key={id}
            style={{
              display: "block",
              position: "absolute",
              top:
                y1 +
                (view.mouse.status === "drag" && view.selection.has(id)
                  ? view.mouse.y - view.mouse.startY
                  : view.mouse.status === "pan"
                  ? view.mouse.y - view.mouse.startY
                  : 0),
              left:
                x1 +
                (view.mouse.status === "drag" && view.selection.has(id)
                  ? view.mouse.x - view.mouse.startX
                  : view.mouse.status === "pan"
                  ? view.mouse.x - view.mouse.startX
                  : 0),
              width: x2 - x1,
              height: y2 - y1,
              overflow: "hidden"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                alignContent: "flex-start"
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <Component width={x2 - x1} height={y2 - y1} options={options} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Canvas;
