import React, { useState, useEffect, useRef } from "react";
import { set, or, not } from "set-fns";

import config from "./config";
import useKeys from "./useKeys";
import reorder from "./reorder";
import { getLayerBounds, transformLayers, alignLayers } from "./layers";

import Canvas from "./Canvas";

import "./reset.css";

const Editor = () => {
  const canvas = useRef(null);
  const [doc, setDoc] = useState({
    layers: [
      {
        id: "1",
        name: "Header 1",
        component: "Primitives / Header",
        x1: 50,
        y1: 100,
        x2: 250,
        y2: 150,
        options: {}
      },
      {
        id: "2",
        name: "Paragraph 1",
        component: "Primitives / Paragraph",
        x1: 100,
        y1: 150,
        x2: 350,
        y2: 300,
        options: {
          text:
            "Now is the time for all good men to come to the aid of their party."
        }
      }
    ]
  });
  const [view, setView] = useState({
    selection: set(["1", "2"]),
    transform: {
      x: 0,
      y: 0,
      scale: 1
    },
    width: 0,
    height: 0,
    mouse: {
      status: "up", // "up", "down", "drag", "select" or "pan"
      x: 0,
      y: 0,
      startX: 0,
      startY: 0
    }
  });
  const transformSelection = transform => {
    setDoc(doc => {
      return {
        ...doc,
        layers: transformLayers(doc.layers, transform, layer =>
          view.selection.has(layer.id)
        )
      };
    });
  };
  useEffect(() => {
    window.postMessage({ type: "update_canvas", doc, view }, "*");
  }, [doc, view]);
  // TODO: Something more sophisticated than an interval.
  useEffect(() => {
    const interval = setInterval(() => {
      if (canvas.current) {
        const rect = canvas.current.getBoundingClientRect();
        setView(view => ({
          ...view,
          width: rect.width,
          height: rect.height
        }));
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const selectionBounds = getLayerBounds(
    doc.layers.filter(layer => view.selection.has(layer.id))
  );
  const keys = useKeys({
    keydown: ({ keyCode }) => {
      switch (keyCode) {
        // left
        case 37:
          transformSelection({
            x: Math.round(selectionBounds.x1) - (keys.has(16) ? 10 : 1)
          });
          break;
        // up
        case 38:
          transformSelection({
            y: Math.round(selectionBounds.y1) - (keys.has(16) ? 10 : 1)
          });
          break;
        // right
        case 39:
          transformSelection({
            x: Math.round(selectionBounds.x1) + (keys.has(16) ? 10 : 1)
          });
          break;
        // down
        case 40:
          transformSelection({
            y: Math.round(selectionBounds.y1) + (keys.has(16) ? 10 : 1)
          });
          break;
        // backspace
        case 8:
          setView(current => ({
            ...current,
            selection: set()
          }));
          setDoc(current => ({
            ...current,
            layers: current.layers.filter(({ id }) => !view.selection.has(id))
          }));
          break;
        default:
          // console.log(keyCode);
          break;
      }
    }
  });
  return (
    <div
      style={{
        display: "grid",
        height: "100%",
        gridTemplateColumns: "200px 1fr 200px"
      }}
    >
      <div
        style={{
          background: "#eee",
          height: "100%",
          overflowY: "scroll",
          userSelect: "none"
        }}
        onClick={event => {
          event.stopPropagation();
          setView(current => ({ ...current, selection: set([]) }));
        }}
      >
        <h2>Layers</h2>
        <ol>
          {doc.layers.map(({ id, name }) => (
            <li
              key={id}
              style={{
                color: view.selection.has(id) ? "red" : null,
                cursor: "pointer"
              }}
              onClick={event => {
                event.stopPropagation();
                setView(current => ({
                  ...current,
                  selection: keys.has(16)
                    ? current.selection.has(id)
                      ? not(current.selection, [id])
                      : or(current.selection, [id])
                    : set([id])
                }));
              }}
            >
              {name}
            </li>
          ))}
        </ol>
      </div>
      <div
        ref={canvas}
        style={{
          overflow: "hidden",
          position: "relative",
          cursor:
            view.mouse.status === "pan"
              ? "grabbing"
              : keys.has(32)
              ? "grab"
              : null
        }}
        onMouseDown={
          view.mouse.status === "up"
            ? ({ clientX, clientY }) => {
                const rect = canvas.current.getBoundingClientRect();
                const x = clientX - rect.x - view.transform.x;
                const y = clientY - rect.y - view.transform.y;
                setView(current => ({
                  ...current,
                  mouse: {
                    ...current.mouse,
                    status: "down",
                    x,
                    y,
                    startX: x,
                    startY: y
                  }
                }));
              }
            : null
        }
        onMouseMove={({ clientX, clientY }) => {
          const rect = canvas.current.getBoundingClientRect();
          const x = clientX - rect.x - view.transform.x;
          const y = clientY - rect.y - view.transform.y;
          setView(current => ({
            ...current,
            mouse: {
              ...current.mouse,
              x: clientX - rect.x - current.transform.x,
              y: clientY - rect.y - current.transform.y
            }
          }));
          if (view.mouse.status === "down") {
            const dx = x - view.mouse.startX;
            const dy = y - view.mouse.startY;
            const distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
            if (distance > 1) {
              if (keys.has(32)) {
                setView(current => ({
                  ...current,
                  mouse: {
                    ...current.mouse,
                    status: "pan"
                  }
                }));
              } else if (
                selectionBounds.x1 < view.mouse.startX &&
                selectionBounds.x2 > view.mouse.startX &&
                selectionBounds.y1 < view.mouse.startY &&
                selectionBounds.y2 > view.mouse.startY
              ) {
                setView(current => ({
                  ...current,
                  mouse: {
                    ...current.mouse,
                    status: "drag"
                  }
                }));
              } else {
                const layersUnderClick = doc.layers.filter(
                  layer =>
                    layer.x1 < view.mouse.startX &&
                    layer.x2 > view.mouse.startX &&
                    layer.y1 < view.mouse.startY &&
                    layer.y2 > view.mouse.startY
                );
                if (layersUnderClick.length > 0) {
                  const clickedLayer =
                    layersUnderClick[layersUnderClick.length - 1];
                  setView(current => ({
                    ...current,
                    selection: keys.has(16)
                      ? current.selection.has(clickedLayer.id)
                        ? not(current.selection, [clickedLayer.id])
                        : or(current.selection, [clickedLayer.id])
                      : set([clickedLayer.id])
                  }));
                  setView(current => ({
                    ...current,
                    mouse: {
                      ...current.mouse,
                      status: "drag"
                    }
                  }));
                } else {
                  setView(current => ({
                    ...current,
                    mouse: {
                      ...current.mouse,
                      status: "select"
                    }
                  }));
                }
              }
            }
          }
        }}
        onMouseUp={
          view.mouse.status !== "up"
            ? ({ clientX, clientY }) => {
                if (view.mouse.status === "down") {
                  const layersUnderClick = doc.layers.filter(
                    layer =>
                      layer.x1 < view.mouse.x &&
                      layer.x2 > view.mouse.x &&
                      layer.y1 < view.mouse.y &&
                      layer.y2 > view.mouse.y
                  );
                  if (layersUnderClick.length > 0) {
                    const clickedLayer =
                      layersUnderClick[layersUnderClick.length - 1];
                    setView(current => ({
                      ...current,
                      selection: keys.has(16)
                        ? current.selection.has(clickedLayer.id)
                          ? not(current.selection, [clickedLayer.id])
                          : or(current.selection, [clickedLayer.id])
                        : set([clickedLayer.id])
                    }));
                  } else {
                    setView(current => ({
                      ...current,
                      selection: set([])
                    }));
                  }
                } else if (view.mouse.status === "drag") {
                  transformSelection({
                    x: selectionBounds.x1 + view.mouse.x - view.mouse.startX,
                    y: selectionBounds.y1 + view.mouse.y - view.mouse.startY
                  });
                } else if (view.mouse.status === "select") {
                  const x1 = Math.min(view.mouse.startX, view.mouse.x);
                  const y1 = Math.min(view.mouse.startY, view.mouse.y);
                  const x2 = Math.max(view.mouse.startX, view.mouse.x);
                  const y2 = Math.max(view.mouse.startY, view.mouse.y);
                  setView(current => ({
                    ...current,
                    selection: set(
                      doc.layers
                        .filter(
                          layer =>
                            layer.x1 < x2 &&
                            layer.x2 > x1 &&
                            layer.y1 < y2 &&
                            layer.y2 > y1
                        )
                        .map(({ id }) => id)
                    )
                  }));
                } else if (view.mouse.status === "pan") {
                  setView(current => ({
                    ...current,
                    transform: {
                      ...current.transform,
                      x:
                        current.transform.x +
                        (view.mouse.x - view.mouse.startX),
                      y:
                        current.transform.y + (view.mouse.y - view.mouse.startY)
                    }
                  }));
                }
                setView(current => ({
                  ...current,
                  mouse: {
                    ...current.mouse,
                    status: "up"
                  }
                }));
              }
            : null
        }
      >
        {/* IFRAME START */}
        <div
          style={{
            pointerEvents: "none",
            userSelect: "none",
            width: view.width,
            height: view.height,
            overflow: "hidden"
          }}
        >
          <Canvas />
        </div>
        {/* IFRAME END */}
        <svg
          style={{
            pointerEvents: "none",
            userSelect: "none",
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
          width={view.width}
          height={view.height}
          fill="none"
        >
          <rect
            stroke="#f0f"
            strokeWidth={2}
            x={
              selectionBounds.x1 +
              view.transform.x +
              (view.mouse.status === "drag" || view.mouse.status === "pan"
                ? view.mouse.x - view.mouse.startX
                : 0)
            }
            y={
              selectionBounds.y1 +
              view.transform.y +
              (view.mouse.status === "drag" || view.mouse.status === "pan"
                ? view.mouse.y - view.mouse.startY
                : 0)
            }
            width={selectionBounds.x2 - selectionBounds.x1}
            height={selectionBounds.y2 - selectionBounds.y1}
          />
          {doc.layers
            .filter(({ id }) => view.selection.has(id))
            .map(({ id, x1, y1, x2, y2 }) => (
              <rect
                key={id}
                stroke="#f0f"
                strokeWidth={1}
                strokeDasharray={[1, 3]}
                x={
                  x1 +
                  view.transform.x +
                  (view.mouse.status === "drag" || view.mouse.status === "pan"
                    ? view.mouse.x - view.mouse.startX
                    : 0) +
                  0.5
                }
                y={
                  y1 +
                  view.transform.y +
                  (view.mouse.status === "drag" || view.mouse.status === "pan"
                    ? view.mouse.y - view.mouse.startY
                    : 0) +
                  0.5
                }
                width={x2 - x1 - 1}
                height={y2 - y1 - 1}
              />
            ))}
          {view.mouse.status === "up"
            ? [
                doc.layers
                  .filter(
                    ({ x1, y1, x2, y2 }) =>
                      view.mouse.x > x1 &&
                      view.mouse.x < x2 &&
                      view.mouse.y > y1 &&
                      view.mouse.y < y2
                  )
                  .slice(-1)[0]
              ]
                .filter(Boolean)
                .filter(({ id }) => !view.selection.has(id))
                .map(({ id, x1, y1, x2, y2 }) => (
                  <rect
                    key={id}
                    stroke="#f0f"
                    strokeWidth={1}
                    strokeDasharray={[1, 3]}
                    x={
                      x1 +
                      view.transform.x +
                      (view.mouse.status === "drag"
                        ? view.mouse.x - view.mouse.startX
                        : 0) +
                      0.5
                    }
                    y={
                      y1 +
                      view.transform.y +
                      (view.mouse.status === "drag"
                        ? view.mouse.y - view.mouse.startY
                        : 0) +
                      0.5
                    }
                    width={x2 - x1 - 1}
                    height={y2 - y1 - 1}
                  />
                ))
            : null}
          {view.mouse.status === "select" ? (
            <rect
              stroke="#f0f"
              strokeWidth={1}
              strokeDasharray={[1, 2]}
              x={
                view.transform.x +
                Math.min(view.mouse.startX, view.mouse.x) +
                0.5
              }
              y={
                view.transform.y +
                Math.min(view.mouse.startY, view.mouse.y) +
                0.5
              }
              width={Math.max(
                Math.max(view.mouse.startX, view.mouse.x) -
                  Math.min(view.mouse.startX, view.mouse.x) -
                  1,
                0
              )}
              height={Math.max(
                Math.max(view.mouse.startY, view.mouse.y) -
                  Math.min(view.mouse.startY, view.mouse.y) -
                  1,
                0
              )}
            />
          ) : null}
        </svg>
      </div>
      <div style={{ background: "#eee" }}>
        {view.selection.size === 0 ? (
          <>
            <h2>Insert</h2>
            <div>
              {Object.keys(config).map(component => (
                <button
                  key={component}
                  onClick={() => {
                    const id = (Math.random() * 0xffffff).toString(16);
                    setDoc(document => ({
                      ...document,
                      layers: [
                        ...document.layers,
                        {
                          id,
                          name: `${component}`,
                          component: component,
                          x1: -view.transform.x,
                          y1: -view.transform.y,
                          x2: -view.transform.x + config[component].defaultWidth,
                          y2:
                            -view.transform.y + config[component].defaultHeight,
                          options: config[component].options?.reduce(
                            (result, option) => ({
                              ...result,
                              [option.key]: option.default()
                            }),
                            {}
                          )
                        }
                      ]
                    }));
                    setView(current => ({
                      ...current,
                      selection: set([id])
                    }));
                  }}
                >
                  {component}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2>Info</h2>
            <p>
              name:{" "}
              <input
                disabled={view.selection.size !== 1}
                value={
                  view.selection.size > 1
                    ? "Multiple layers selected"
                    : doc.layers.find(({ id }) => id === [...view.selection][0])
                        .name
                }
                onChange={({ currentTarget: { value } }) => {
                  setDoc(
                    view.selection.size === 1
                      ? current => ({
                          ...current,
                          layers: current.layers.map(layer =>
                            layer.id === [...view.selection][0]
                              ? { ...layer, name: value }
                              : layer
                          )
                        })
                      : null
                  );
                }}
              />
            </p>
            <p>
              x:{" "}
              <input
                type="number"
                value={Math.round(selectionBounds.x1)}
                onChange={({ currentTarget: { value } }) => {
                  transformSelection({
                    x: parseInt(value || 0, 10)
                  });
                }}
              />
            </p>
            <p>
              y:{" "}
              <input
                type="number"
                value={Math.round(selectionBounds.y1)}
                onChange={({ currentTarget: { value } }) => {
                  transformSelection({
                    y: parseInt(value || 0, 10)
                  });
                }}
              />
            </p>
            <p>
              width:{" "}
              <input
                type="number"
                value={Math.round(selectionBounds.x2 - selectionBounds.x1)}
                onChange={({ currentTarget: { value } }) => {
                  transformSelection({
                    w: parseInt(value || 0, 10)
                  });
                }}
              />
            </p>
            <p>
              height:{" "}
              <input
                type="number"
                value={Math.round(selectionBounds.y2 - selectionBounds.y1)}
                onChange={({ currentTarget: { value } }) => {
                  transformSelection({
                    h: parseInt(value || 0, 10)
                  });
                }}
              />
            </p>
            <p>
              {[
                { label: "Left", alignment: { x: -1 } },
                { label: "Center", alignment: { x: 0 } },
                { label: "Right", alignment: { x: 1 } }
              ].map(({ label, alignment }) => (
                <button
                  key={label}
                  disabled={view.selection.size < 2}
                  onClick={() => {
                    setDoc(doc => ({
                      ...doc,
                      layers: alignLayers(doc.layers, alignment, layer =>
                        view.selection.has(layer.id)
                      )
                    }));
                  }}
                >
                  {label}
                </button>
              ))}
            </p>
            <p>
              {[
                { label: "Top", alignment: { y: -1 } },
                { label: "Middle", alignment: { y: 0 } },
                { label: "Bottom", alignment: { y: 1 } }
              ].map(({ label, alignment }) => (
                <button
                  key={label}
                  disabled={view.selection.size < 2}
                  onClick={() => {
                    setDoc(doc => ({
                      ...doc,
                      layers: alignLayers(doc.layers, alignment, layer =>
                        view.selection.has(layer.id)
                      )
                    }));
                  }}
                >
                  {label}
                </button>
              ))}
            </p>
            <p>
              <button
                disabled={
                  view.selection.size !== 1 ||
                  doc.layers.findIndex(
                    ({ id }) => id === [...view.selection][0]
                  ) ===
                    doc.layers.length - 1
                }
                onClick={() => {
                  setDoc(current => ({
                    ...current,
                    layers: reorder(
                      current.layers,
                      current.layers.findIndex(
                        ({ id }) => id === [...view.selection][0]
                      ),
                      current.layers.findIndex(
                        ({ id }) => id === [...view.selection][0]
                      ) + 1
                    )
                  }));
                }}
              >
                Bring Forward
              </button>
              <button
                disabled={
                  view.selection.size !== 1 ||
                  doc.layers.findIndex(
                    ({ id }) => id === [...view.selection][0]
                  ) ===
                    doc.layers.length - 1
                }
                onClick={() => {
                  setDoc(current => ({
                    ...current,
                    layers: reorder(
                      current.layers,
                      current.layers.findIndex(
                        ({ id }) => id === [...view.selection][0]
                      ),
                      current.layers.length - 1
                    )
                  }));
                }}
              >
                Bring to Front
              </button>
              <button
                disabled={
                  view.selection.size !== 1 ||
                  doc.layers.findIndex(
                    ({ id }) => id === [...view.selection][0]
                  ) === 0
                }
                onClick={() => {
                  setDoc(current => ({
                    ...current,
                    layers: reorder(
                      current.layers,
                      current.layers.findIndex(
                        ({ id }) => id === [...view.selection][0]
                      ),
                      current.layers.findIndex(
                        ({ id }) => id === [...view.selection][0]
                      ) - 1
                    )
                  }));
                }}
              >
                Send Backward
              </button>
              <button
                disabled={
                  view.selection.size !== 1 ||
                  doc.layers.findIndex(
                    ({ id }) => id === [...view.selection][0]
                  ) === 0
                }
                onClick={() => {
                  setDoc(current => ({
                    ...current,
                    layers: reorder(
                      current.layers,
                      current.layers.findIndex(
                        ({ id }) => id === [...view.selection][0]
                      ),
                      0
                    )
                  }));
                }}
              >
                Send to Back
              </button>
            </p>
            {view.selection.size === 1 ? (
              <>
                <h2>Options</h2>
                {config[
                  doc.layers.find(({ id }) => id === [...view.selection][0])
                    .component
                ].options?.map(({ key, input }) => {
                  switch (input) {
                    case "short-string":
                      return (
                        <input
                          key={key}
                          type="text"
                          value={
                            doc.layers.find(
                              ({ id }) => id === [...view.selection][0]
                            ).options[key]
                          }
                          onChange={({ currentTarget: { value } }) => {
                            setDoc(current => ({
                              ...current,
                              layers: current.layers.map(layer =>
                                layer.id === [...view.selection][0]
                                  ? {
                                      ...layer,
                                      options: {
                                        ...layer.options,
                                        [key]: value
                                      }
                                    }
                                  : layer
                              )
                            }));
                          }}
                        />
                      );
                  }
                })}
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Editor;
