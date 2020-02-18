import React, { Fragment, useState, useEffect, useRef } from "react";
import { set, or, not, and } from "set-fns";
import useStateSnapshots from "use-state-snapshots";
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";

import config from "./config";
import useKeys from "./useKeys";
import reorder from "./reorder";
import pushID from "./pushID";
import {
  getLayerBounds,
  transformLayers,
  alignLayers,
  resizeLayersToExtreme
} from "./layers";

import AlignBottom from "./icons/AlignBottom";
import AlignHorizontalMiddle from "./icons/AlignHorizontalMiddle";
import AlignLeft from "./icons/AlignLeft";
import AlignRight from "./icons/AlignRight";
import AlignTop from "./icons/AlignTop";
import AlignVerticalMiddle from "./icons/AlignVerticalMiddle";
import FitContent from "./icons/FitContent";
import FitContentHeight from "./icons/FitContentHeight";
import FitContentWidth from "./icons/FitContentWidth";
import MoveBackward from "./icons/MoveBackward";
import MoveForward from "./icons/MoveForward";
import MoveToBack from "./icons/MoveToBack";
import MoveToFront from "./icons/MoveToFront";

const measure = ({ type, width, height, options }, callback) => {
  const id = pushID();
  const receiveMessage = event => {
    if (
      event.data.type === "sketchbook_measure_layer_response" &&
      event.data.id === id
    ) {
      callback(event.data.width, event.data.height);
      window.removeEventListener("message", receiveMessage);
    }
  };
  window.addEventListener("message", receiveMessage);
  window.postMessage(
    {
      type: "sketchbook_measure_layer_request",
      layer: {
        id,
        type,
        width,
        height,
        options
      }
    },
    "*"
  );
};

const PanelTitle = ({ style, children, ...props }) => (
  <h2
    style={{
      color: "#000",
      fontWeight: "bold",
      fontSize: 14,
      fontVariantCaps: "small-caps",
      padding: "0 6px",
      borderBottom: "1px solid #ddd",
      ...style
    }}
    {...props}
  >
    {children}
  </h2>
);

const Label = props => (
  <label
    style={{
      fontWeight: "bold"
    }}
    {...props}
  />
);

const Input = ({ style, ...props }) => (
  <input
    style={{
      background: "#fff",
      border: "1px solid #ddd",
      padding: "0 3px",
      ...style
    }}
    {...props}
  />
);

const Button = ({ style, disabled, Icon, children, ...props }) => (
  <button
    style={{
      background: "#ddd",
      borderRadius: 2,
      color: disabled ? "#bbb" : null,
      minWidth: 15,
      padding: 5,
      textAlign: "center",
      ...style
    }}
    disabled={disabled}
    {...props}
  >
    {Icon ? <Icon color={disabled ? "#bbb" : undefined} /> : children}
  </button>
);

const Textarea = ({ style, ...props }) => (
  <textarea
    style={{
      background: "#fff",
      border: "1px solid #ddd",
      resize: "none",
      ...style
    }}
    spellCheck="false"
    {...props}
  />
);

const OptionsErrorMessage = ({ children, style, ...props }) => {
  return (
    <div style={{ color: "red", ...style }} {...props}>
      {children}
    </div>
  );
};

const Editor = () => {
  const canvas = useRef(null);
  const [elementBeingDraggedId, setElementBeingDraggedId] = useState(null);
  const [idOfLayerBeingEdited, setIdOfLayerBeingEdited] = useState(null);
  const [viewport, setViewport] = useState({
    x: 0,
    y: 0,
    scale: 1,
    width: 0,
    height: 0
  });
  const [mouse, setMouse] = useState({
    status: "up", // "up", "down", "drag", "select", "pan" or "resize"
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  });
  const [state, setState, pointer, setPointer, snapshots] = useStateSnapshots(
    {
      doc: {
        layers: [
          {
            id: "-LyqdJBMdrVihqnJOOo8",
            name: "Input",
            component: "Input",
            x1: 100,
            y1: 666,
            x2: 500,
            y2: 722,
            options: { label: "Email", value: "" }
          },
          {
            id: "-LyqdsUuufs_UM05V3My",
            name: "Button",
            component: "Button",
            x1: 417.78125,
            y1: 732,
            x2: 500,
            y2: 768,
            options: { label: "Subscribe" }
          },
          {
            id: "-LyqduQ0G84esGuBLiC4",
            name: "Image",
            component: "Image",
            x1: 100,
            y1: 156,
            x2: 340,
            y2: 336
          },
          {
            id: "-Lyr1QcLkjIhPrr7ojKV",
            name: "Heading 1",
            component: "Heading 1",
            x1: 100,
            y1: 100,
            x2: 392.75,
            y2: 136,
            options: { text: "Example Website" }
          },
          {
            id: "-Lyr1U4LM637a9qwzp8I",
            name: "Heading 2",
            component: "Heading 2",
            x1: 350,
            y1: 156,
            x2: 498.34375,
            y2: 180,
            options: { text: "Lorem ipsum" }
          },
          {
            id: "-Lyr1aKzs3cjCk5yyD1R",
            name: "Paragraph",
            component: "Paragraph",
            x1: 350,
            y1: 190,
            x2: 750,
            y2: 310,
            options: {
              text:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            }
          },
          {
            id: "-Lyr2YAEGxGezgs2k5sV",
            name: "Image",
            component: "Image",
            x1: 510,
            y1: 356,
            x2: 750,
            y2: 536
          },
          {
            id: "-Lyr2n5QEWuXLOBwMjlt",
            name: "Heading 2",
            component: "Heading 2",
            x1: 100,
            y1: 356,
            x2: 248.34375,
            y2: 380,
            options: { text: "Lorem ipsum" }
          },
          {
            id: "-Lyr2pytYlfINHOHjB37",
            name: "Paragraph",
            component: "Paragraph",
            x1: 100,
            y1: 390,
            x2: 500,
            y2: 510,
            options: {
              text:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            }
          },
          {
            id: "-Lyr2zBoU64dhef9SyDI",
            name: "Heading 2",
            component: "Heading 2",
            x1: 100,
            y1: 632,
            x2: 248.34375,
            y2: 656,
            options: { text: "Lorem ipsum" }
          },
          {
            id: "-Lyr7tPI3CN8t_0-x0X0",
            name: "Heading 1",
            component: "Heading 1",
            x1: 100,
            y1: 576,
            x2: 340.640625,
            y2: 612,
            options: { text: "Example Form" }
          }
        ]
      },
      selection: set()
    },
    false,
    100
  );
  const { doc, selection } = state;
  const selectionBounds = getLayerBounds(
    doc.layers.filter(layer => selection.has(layer.id))
  );
  const keys = useKeys({
    keydown: event => {
      const codeBlacklist = set([
        "Backspace",
        "ShiftLeft",
        "ShiftRight",
        "ArrowLeft",
        "ArrowUp",
        "ArrowRight",
        "ArrowDown"
      ]);
      if (
        (selection.size > 0 || event.code === "Backspace") &&
        codeBlacklist.has(event.code)
      ) {
        event.preventDefault();
      }
      switch (event.code) {
        case "ArrowLeft":
          transformSelection({
            x:
              Math.round(selectionBounds.x1) -
              (keys.has("ShiftLeft") || keys.has("ShiftRight") ? 10 : 1)
          });
          break;
        case "ArrowUp":
          transformSelection({
            y:
              Math.round(selectionBounds.y1) -
              (keys.has("ShiftLeft") || keys.has("ShiftRight") ? 10 : 1)
          });
          break;
        case "ArrowRight":
          transformSelection({
            x:
              Math.round(selectionBounds.x1) +
              (keys.has("ShiftLeft") || keys.has("ShiftRight") ? 10 : 1)
          });
          break;
        case "ArrowDown":
          transformSelection({
            y:
              Math.round(selectionBounds.y1) +
              (keys.has("ShiftLeft") || keys.has("ShiftRight") ? 10 : 1)
          });
          break;
        case "Backspace":
          setState(
            current => ({
              ...current,
              doc: {
                ...current.doc,
                layers: current.doc.layers.filter(
                  ({ id }) => !current.selection.has(id)
                )
              },
              selection: set()
            }),
            true
          );
          break;
        default:
          console.log(event.code);
          break;
      }
    }
  });
  const mouseIsWithinSelection =
    mouse.x >= selectionBounds.x1 - 3 &&
    mouse.x <= selectionBounds.x2 + 3 &&
    mouse.y >= selectionBounds.y1 - 3 &&
    mouse.y <= selectionBounds.y2 + 3;
  const mouseIsOverSelectionLeft =
    mouseIsWithinSelection && mouse.x <= selectionBounds.x1 + 3;
  const mouseIsOverSelectionRight =
    mouseIsWithinSelection && mouse.x >= selectionBounds.x2 - 3;
  const mouseIsOverSelectionTop =
    mouseIsWithinSelection && mouse.y <= selectionBounds.y1 + 3;
  const mouseIsOverSelectionBottom =
    mouseIsWithinSelection && mouse.y >= selectionBounds.y2 - 3;
  const mouseStartedWithinSelection =
    mouse.startX >= selectionBounds.x1 - 3 &&
    mouse.startX <= selectionBounds.x2 + 3 &&
    mouse.startY >= selectionBounds.y1 - 3 &&
    mouse.startY <= selectionBounds.y2 + 3;
  const mouseStartedOverSelectionLeft =
    mouseStartedWithinSelection && mouse.startX <= selectionBounds.x1 + 3;
  const mouseStartedOverSelectionRight =
    mouseStartedWithinSelection && mouse.startX >= selectionBounds.x2 - 3;
  const mouseStartedOverSelectionTop =
    mouseStartedWithinSelection && mouse.startY <= selectionBounds.y1 + 3;
  const mouseStartedOverSelectionBottom =
    mouseStartedWithinSelection && mouse.startY >= selectionBounds.y2 - 3;
  const lockedAxis =
    and(keys, ["ShiftLeft", "ShiftRight"]).size !== 1
      ? null
      : Math.abs(mouse.x - mouse.startX) > Math.abs(mouse.y - mouse.startY)
      ? "x"
      : "y";
  let transformedLayers = state.doc.layers;
  switch (mouse.status) {
    case "resize":
      transformedLayers = transformLayers(
        transformedLayers,
        {
          w:
            mouseStartedOverSelectionLeft || mouseStartedOverSelectionRight
              ? (mouse.x - mouse.startX) *
                (mouseStartedOverSelectionLeft ? -1 : 1)
              : undefined,
          h:
            mouseStartedOverSelectionTop || mouseStartedOverSelectionBottom
              ? (mouse.y - mouse.startY) *
                (mouseStartedOverSelectionTop ? -1 : 1)
              : undefined,
          cx: mouseStartedOverSelectionLeft ? 1 : 0,
          cy: mouseStartedOverSelectionTop ? 1 : 0,
          relative: true
        },
        layer => state.selection.has(layer.id)
      );
      break;
    case "drag":
      transformedLayers = transformLayers(
        transformedLayers,
        {
          x: !lockedAxis || lockedAxis === "x" ? mouse.x - mouse.startX : null,
          y: !lockedAxis || lockedAxis === "y" ? mouse.y - mouse.startY : null,
          relative: true
        },
        layer => state.selection.has(layer.id)
      );
      break;
    case "pan":
      transformedLayers = transformLayers(transformedLayers, {
        x: mouse.x - mouse.startX,
        y: mouse.y - mouse.startY,
        relative: true
      });
      break;
    default:
      break;
  }
  transformedLayers = transformLayers(transformedLayers, {
    x: viewport.x,
    y: viewport.y,
    relative: true
  });
  const transformedSelectionBounds = getLayerBounds(
    transformedLayers.filter(layer => selection.has(layer.id))
  );
  const display = {
    layers: transformedLayers.map(
      ({ id, component: type, x1, y1, x2, y2, options }) => ({
        id,
        type,
        x: x1,
        y: y1,
        scale: viewport.scale,
        width: x2 - x1,
        height: y2 - y1,
        options
      })
    )
  };
  const transformSelection = (transform, storeSnapshot = true) => {
    setState(
      current => ({
        ...current,
        doc: {
          ...current.doc,
          layers: transformLayers(current.doc.layers, transform, layer =>
            current.selection.has(layer.id)
          )
        }
      }),
      storeSnapshot
    );
  };
  useEffect(() => {
    if (canvas.current) {
      canvas.current.contentWindow.postMessage(
        {
          type: "sketchbook_update_render_layers",
          layers: display.layers
        },
        "*"
      );
    }
  }, [canvas, display.layers]);
  // TODO: Something more sophisticated than an interval.
  useEffect(() => {
    const interval = setInterval(() => {
      if (canvas.current) {
        const rect = canvas.current.getBoundingClientRect();
        setViewport(current => ({
          ...current,
          width: Math.ceil(rect.width),
          height: Math.ceil(rect.height)
        }));
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [setViewport]);
  return (
    <div
      style={{
        display: "grid",
        height: "100%",
        gridTemplateColumns: "300px 1fr 300px"
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
        }}
      >
        <PanelTitle style={{ marginTop: 6 }}>History</PanelTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, min-content)",
            alignItems: "center",
            justifyItems: "center",
            gap: 6,
            padding: 6
          }}
        >
          <Button
            disabled={pointer === 0}
            onClick={() => {
              setPointer(pointer - 1);
            }}
          >
            Undo
          </Button>
          <Button
            disabled={pointer === snapshots.length - 1}
            onClick={() => {
              setPointer(pointer + 1);
            }}
          >
            Redo
          </Button>
        </div>
        <PanelTitle style={{ marginTop: 6 }}>Layers</PanelTitle>
        <DragDropContext
          onDragStart={result => {
            const { draggableId } = result;
            setElementBeingDraggedId(draggableId);
            setState(current => {
              return {
                ...current,
                selection:
                  current.selection.size === 0
                    ? set([draggableId])
                    : current.selection
              };
            });
          }}
          onDragEnd={result => {
            const { destination, source, draggableId } = result;

            setElementBeingDraggedId(null);
            // destination may be null if you drag outside of the droppable area.
            if (
              !destination ||
              (destination.droppableId === source.droppableId &&
                destination.index === source.index)
            ) {
              return;
            }

            setState(current => ({
              ...current,
              doc: {
                ...current.doc,
                layers: reorder(
                  doc.layers,
                  source.index,
                  destination.index,
                  layer => !selection.has(layer.id) || draggableId === layer.id,
                  layer => selection.has(layer.id) && draggableId !== layer.id
                )
              }
            }));
          }}
        >
          <Droppable droppableId={"id"}>
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {doc.layers.map(({ id, name }, i) => (
                  <div
                    key={id}
                    style={{
                      color:
                        elementBeingDraggedId && selection.has(id)
                          ? "#e07aff"
                          : selection.has(id)
                          ? "#f0f"
                          : null,
                      cursor: "pointer",
                      padding: "6px",
                      minHeight: "37px",
                      borderBottom: "1px solid #ddd"
                    }}
                    onClick={event => {
                      event.stopPropagation();
                      setState(
                        current => ({
                          ...current,
                          selection:
                            keys.has("ShiftLeft") || keys.has("ShiftRight")
                              ? current.selection.has(id)
                                ? not(current.selection, [id])
                                : or(current.selection, [id])
                              : set([id])
                        }),
                        true
                      );
                    }}
                    onDoubleClick={() => setIdOfLayerBeingEdited(id)}
                    onBlur={() => setIdOfLayerBeingEdited(null)}
                  >
                    <Draggable draggableId={id} index={i}>
                      {provided => {
                        return idOfLayerBeingEdited === id ? (
                          <input
                            type="text"
                            autoFocus
                            onChange={event => {
                              const updatedName = event.currentTarget.value;
                              setState(current => ({
                                ...current,
                                doc: {
                                  ...current.doc,
                                  layers: current.doc.layers.map(layer => {
                                    return layer.id === id
                                      ? { ...layer, name: updatedName }
                                      : layer;
                                  })
                                }
                              }));
                            }}
                            value={name}
                          />
                        ) : (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            // Inline styles must be applied by extending the draggableProps.style object and the new styles must be applied after provided.draggableProps is applied. https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/draggable.md#extending-draggablepropsstyle
                            style={{
                              border: "1px solid black",
                              display: "flex",
                              justifyContent: "space-between",
                              ...provided.draggableProps.style
                            }}
                            ref={provided.innerRef}
                          >
                            <span>
                              {name.trim() === "" ? "Unnamed layer" : name}
                            </span>
                            <span>
                              {elementBeingDraggedId === id &&
                                state.selection.size > 1 &&
                                state.selection.size}
                            </span>
                          </div>
                        );
                      }}
                    </Draggable>
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div
        style={{
          overflow: "hidden",
          position: "relative",
          cursor:
            mouse.status === "pan"
              ? "grabbing"
              : keys.has("Space")
              ? "grab"
              : state.selection.size > 0 &&
                ((mouseIsOverSelectionLeft && mouseIsOverSelectionTop) ||
                  (mouseIsOverSelectionRight && mouseIsOverSelectionBottom))
              ? "nwse-resize"
              : state.selection.size > 0 &&
                ((mouseIsOverSelectionLeft && mouseIsOverSelectionBottom) ||
                  (mouseIsOverSelectionRight && mouseIsOverSelectionTop))
              ? "nesw-resize"
              : state.selection.size > 0 &&
                (mouseIsOverSelectionLeft || mouseIsOverSelectionRight)
              ? "ew-resize"
              : state.selection.size > 0 &&
                (mouseIsOverSelectionTop || mouseIsOverSelectionBottom)
              ? "ns-resize"
              : null
        }}
        onMouseDown={
          mouse.status === "up"
            ? ({ clientX, clientY }) => {
                const rect = canvas.current.getBoundingClientRect();
                const x = clientX - rect.x - viewport.x;
                const y = clientY - rect.y - viewport.y;
                setMouse(current => ({
                  ...current,
                  status: "down",
                  x,
                  y,
                  startX: x,
                  startY: y
                }));
              }
            : null
        }
        onMouseMove={({ clientX, clientY }) => {
          const rect = canvas.current.getBoundingClientRect();
          const x = clientX - rect.x - viewport.x;
          const y = clientY - rect.y - viewport.y;
          setMouse(current => ({
            ...current,
            x: clientX - rect.x - viewport.x,
            y: clientY - rect.y - viewport.y
          }));
          if (mouse.status === "down") {
            const dx = x - mouse.startX;
            const dy = y - mouse.startY;
            const distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
            if (distance > 1) {
              if (keys.has("Space")) {
                setMouse(current => ({
                  ...current,
                  status: "pan"
                }));
              } else if (
                mouseStartedOverSelectionLeft ||
                mouseStartedOverSelectionRight ||
                mouseStartedOverSelectionTop ||
                mouseStartedOverSelectionBottom
              ) {
                setMouse(current => ({
                  ...current,
                  status: "resize"
                }));
              } else if (
                selectionBounds.x1 < mouse.startX &&
                selectionBounds.x2 > mouse.startX &&
                selectionBounds.y1 < mouse.startY &&
                selectionBounds.y2 > mouse.startY
              ) {
                setMouse(current => ({
                  ...current,
                  status: "drag"
                }));
              } else {
                const layersUnderClick = doc.layers.filter(
                  layer =>
                    layer.x1 < mouse.startX &&
                    layer.x2 > mouse.startX &&
                    layer.y1 < mouse.startY &&
                    layer.y2 > mouse.startY
                );
                if (layersUnderClick.length > 0) {
                  const clickedLayer =
                    layersUnderClick[layersUnderClick.length - 1];
                  setState(
                    current => ({
                      ...current,
                      selection:
                        keys.has("ShiftLeft") || keys.has("ShiftRight")
                          ? current.selection.has(clickedLayer.id)
                            ? not(current.selection, [clickedLayer.id])
                            : or(current.selection, [clickedLayer.id])
                          : set([clickedLayer.id])
                    }),
                    true
                  );
                  setMouse(current => ({
                    ...current,
                    status: "drag"
                  }));
                } else {
                  setMouse(current => ({
                    ...current,
                    status: "select"
                  }));
                }
              }
            }
          }
        }}
        onMouseUp={
          mouse.status !== "up"
            ? ({ clientX, clientY }) => {
                if (mouse.status === "down") {
                  const layersUnderClick = doc.layers.filter(
                    layer =>
                      layer.x1 < mouse.x &&
                      layer.x2 > mouse.x &&
                      layer.y1 < mouse.y &&
                      layer.y2 > mouse.y
                  );
                  if (layersUnderClick.length > 0) {
                    const clickedLayer =
                      layersUnderClick[layersUnderClick.length - 1];
                    setState(
                      current => ({
                        ...current,
                        selection:
                          keys.has("ShiftLeft") || keys.has("ShiftRight")
                            ? current.selection.has(clickedLayer.id)
                              ? not(current.selection, [clickedLayer.id])
                              : or(current.selection, [clickedLayer.id])
                            : set([clickedLayer.id])
                      }),
                      true
                    );
                  } else {
                    setState(
                      current => ({
                        ...current,
                        selection: mouseIsWithinSelection
                          ? current.selection
                          : set()
                      }),
                      true
                    );
                  }
                } else if (mouse.status === "drag") {
                  transformSelection({
                    x:
                      !lockedAxis || lockedAxis === "x"
                        ? selectionBounds.x1 + mouse.x - mouse.startX
                        : lockedAxis === "y"
                        ? selectionBounds.x1
                        : null,
                    y:
                      !lockedAxis || lockedAxis === "y"
                        ? selectionBounds.y1 + mouse.y - mouse.startY
                        : lockedAxis === "x"
                        ? selectionBounds.y1
                        : null
                  });
                } else if (mouse.status === "select") {
                  const x1 = Math.min(mouse.startX, mouse.x);
                  const y1 = Math.min(mouse.startY, mouse.y);
                  const x2 = Math.max(mouse.startX, mouse.x);
                  const y2 = Math.max(mouse.startY, mouse.y);
                  setState(
                    current => ({
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
                    }),
                    true
                  );
                } else if (mouse.status === "pan") {
                  setViewport(current => ({
                    ...current,
                    x: current.x + (mouse.x - mouse.startX),
                    y: current.y + (mouse.y - mouse.startY)
                  }));
                } else if (mouse.status === "resize") {
                  transformSelection({
                    w:
                      mouseStartedOverSelectionLeft ||
                      mouseStartedOverSelectionRight
                        ? selectionBounds.x2 -
                          selectionBounds.x1 +
                          (mouse.x - mouse.startX) *
                            (mouseStartedOverSelectionLeft ? -1 : 1)
                        : undefined,
                    h:
                      mouseStartedOverSelectionTop ||
                      mouseStartedOverSelectionBottom
                        ? selectionBounds.y2 -
                          selectionBounds.y1 +
                          (mouse.y - mouse.startY) *
                            (mouseStartedOverSelectionTop ? -1 : 1)
                        : undefined,
                    cx: mouseStartedOverSelectionLeft ? 1 : 0,
                    cy: mouseStartedOverSelectionTop ? 1 : 0
                  });
                }
                setMouse(current => ({
                  ...current,
                  status: "up"
                }));
              }
            : null
        }
      >
        <iframe
          title="Canvas"
          ref={canvas}
          src="/canvas/index.html"
          style={{
            border: "none",
            height: "100%",
            overflow: "hidden",
            pointerEvents: "none",
            userSelect: "none",
            width: "100%"
          }}
        ></iframe>
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
          width={viewport.width}
          height={viewport.height}
          fill="none"
        >
          {display.layers
            .filter(({ id }) => selection.has(id))
            .map(({ id, x, y, width, height }) => (
              <rect
                key={id}
                stroke="#f0f"
                strokeWidth={1}
                strokeDasharray={[1, 3]}
                x={x + 0.5}
                y={y + 0.5}
                width={width - 1}
                height={height - 1}
              />
            ))}
          {state.selection.size > 0 ? (
            <>
              <rect
                stroke="#f0f"
                strokeWidth={2}
                x={transformedSelectionBounds.x1}
                y={transformedSelectionBounds.y1}
                width={
                  transformedSelectionBounds.x2 - transformedSelectionBounds.x1
                }
                height={
                  transformedSelectionBounds.y2 - transformedSelectionBounds.y1
                }
              />
              <rect
                stroke="#f0f"
                fill="#fff"
                x={transformedSelectionBounds.x1 - 2.5}
                y={transformedSelectionBounds.y1 - 2.5}
                width={5}
                height={5}
              />
              <rect
                stroke="#f0f"
                fill="#fff"
                x={transformedSelectionBounds.x1 - 2.5}
                y={transformedSelectionBounds.y2 - 2.5}
                width={5}
                height={5}
              />
              <rect
                stroke="#f0f"
                fill="#fff"
                x={transformedSelectionBounds.x2 - 2.5}
                y={transformedSelectionBounds.y1 - 2.5}
                width={5}
                height={5}
              />
              <rect
                stroke="#f0f"
                fill="#fff"
                x={transformedSelectionBounds.x2 - 2.5}
                y={transformedSelectionBounds.y2 - 2.5}
                width={5}
                height={5}
              />
              <rect
                stroke="#f0f"
                fill="#fff"
                x={
                  Math.round(
                    transformedSelectionBounds.x1 +
                      (transformedSelectionBounds.x2 -
                        transformedSelectionBounds.x1) /
                        2
                  ) - 2.5
                }
                y={transformedSelectionBounds.y1 - 2.5}
                width={5}
                height={5}
              />
              <rect
                stroke="#f0f"
                fill="#fff"
                x={
                  Math.round(
                    transformedSelectionBounds.x1 +
                      (transformedSelectionBounds.x2 -
                        transformedSelectionBounds.x1) /
                        2
                  ) - 2.5
                }
                y={transformedSelectionBounds.y2 - 2.5}
                width={5}
                height={5}
              />
              <rect
                stroke="#f0f"
                fill="#fff"
                x={transformedSelectionBounds.x1 - 2.5}
                y={
                  Math.round(
                    transformedSelectionBounds.y1 +
                      (transformedSelectionBounds.y2 -
                        transformedSelectionBounds.y1) /
                        2
                  ) - 2.5
                }
                width={5}
                height={5}
              />
              <rect
                stroke="#f0f"
                fill="#fff"
                x={transformedSelectionBounds.x2 - 2.5}
                y={
                  Math.round(
                    transformedSelectionBounds.y1 +
                      (transformedSelectionBounds.y2 -
                        transformedSelectionBounds.y1) /
                        2
                  ) - 2.5
                }
                width={5}
                height={5}
              />
            </>
          ) : null}
          {mouse.status === "up"
            ? [
                doc.layers
                  .filter(
                    ({ x1, y1, x2, y2 }) =>
                      mouse.x >= x1 &&
                      mouse.x <= x2 &&
                      mouse.y >= y1 &&
                      mouse.y <= y2
                  )
                  .slice(-1)[0]
              ]
                .filter(Boolean)
                .filter(({ id }) => !selection.has(id))
                .map(({ id, x1, y1, x2, y2 }) => (
                  <rect
                    key={id}
                    stroke="#f0f"
                    strokeWidth={1}
                    strokeDasharray={[1, 3]}
                    x={
                      x1 +
                      viewport.x +
                      (mouse.status === "drag" ? mouse.x - mouse.startX : 0) +
                      0.5
                    }
                    y={
                      y1 +
                      viewport.y +
                      (mouse.status === "drag" ? mouse.y - mouse.startY : 0) +
                      0.5
                    }
                    width={x2 - x1 - 1}
                    height={y2 - y1 - 1}
                  />
                ))
            : null}
          {mouse.status === "select" ? (
            <rect
              stroke="#f0f"
              strokeWidth={1}
              strokeDasharray={[1, 2]}
              x={viewport.x + Math.min(mouse.startX, mouse.x) + 0.5}
              y={viewport.y + Math.min(mouse.startY, mouse.y) + 0.5}
              width={Math.max(
                Math.max(mouse.startX, mouse.x) -
                  Math.min(mouse.startX, mouse.x) -
                  1,
                0
              )}
              height={Math.max(
                Math.max(mouse.startY, mouse.y) -
                  Math.min(mouse.startY, mouse.y) -
                  1,
                0
              )}
            />
          ) : null}
        </svg>
      </div>
      <div style={{ background: "#eee" }}>
        {selection.size === 0 ? (
          <>
            <PanelTitle>Insert</PanelTitle>
            <div
              style={{
                display: "grid",
                alignItems: "center",
                justifyItems: "left",
                gap: 6,
                padding: 6
              }}
            >
              {Object.keys(config)
                .sort((a, b) => a.localeCompare(b))
                .map(component => (
                  <Button
                    key={component}
                    onClick={() => {
                      const id = pushID();
                      const initial =
                        config[component].init && config[component].init();
                      measure(
                        { type: component, ...initial },
                        (width, height) => {
                          setState(
                            current => ({
                              ...current,
                              doc: {
                                ...current.doc,
                                layers: [
                                  ...current.doc.layers,
                                  {
                                    id,
                                    name: `${component}`,
                                    component,
                                    x1: -viewport.x,
                                    y1: -viewport.y,
                                    x2: -viewport.x + width,
                                    y2: -viewport.y + height,
                                    options: initial?.options
                                  }
                                ]
                              },
                              selection: set([id])
                            }),
                            true
                          );
                        }
                      );
                    }}
                  >
                    {component}
                  </Button>
                ))}
            </div>
          </>
        ) : (
          <>
            <PanelTitle>Info</PanelTitle>
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(1, min-content 1fr)",
                  alignItems: "center",
                  justifyItems: "center",
                  gap: 6,
                  padding: 6
                }}
              >
                <Label>Name</Label>
                <Input
                  id="info-panel-name"
                  disabled={selection.size !== 1}
                  value={
                    doc.layers.find(({ id }) => id === [...selection][0]).name
                  }
                  onChange={({ currentTarget: { value } }) => {
                    setState(
                      current =>
                        selection.size === 1
                          ? {
                              ...current,
                              doc: {
                                ...current.doc,
                                layers: current.doc.layers.map(layer =>
                                  layer.id === [...selection][0]
                                    ? { ...layer, name: value }
                                    : layer
                                )
                              }
                            }
                          : current,
                      true
                    );
                  }}
                />
              </div>
            )}
            <PanelTitle>Dimensions</PanelTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, min-content 1fr)",
                alignItems: "center",
                justifyItems: "center",
                gap: "6px",
                padding: 6
              }}
            >
              <Label htmlFor="info-panel-x">X</Label>
              <Input
                id="info-panel-x"
                type="number"
                value={Math.round(selectionBounds.x1)}
                onChange={({ currentTarget: { value } }) => {
                  transformSelection({
                    x: parseInt(value || 0, 10)
                  });
                }}
              />
              <Label htmlFor="info-panel-y">Y</Label>
              <Input
                id="info-panel-y"
                type="number"
                value={Math.round(selectionBounds.y1)}
                onChange={({ currentTarget: { value } }) => {
                  transformSelection({
                    y: parseInt(value || 0, 10)
                  });
                }}
              />
              <Label htmlFor="info-panel-w">W</Label>
              <Input
                type="number"
                value={Math.round(selectionBounds.x2 - selectionBounds.x1)}
                onChange={({ currentTarget: { value } }) => {
                  transformSelection({
                    w: parseInt(value || 0, 10)
                  });
                }}
              />
              <Label htmlFor="info-panel-h">H</Label>
              <Input
                type="number"
                value={Math.round(selectionBounds.y2 - selectionBounds.y1)}
                onChange={({ currentTarget: { value } }) => {
                  transformSelection({
                    h: parseInt(value || 0, 10)
                  });
                }}
              />
            </div>
            <PanelTitle style={{ marginTop: 6 }}>Resize</PanelTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, min-content)",
                alignItems: "center",
                justifyItems: "center",
                gap: 6,
                padding: 6
              }}
            >
              <Button
                disabled={selection.size !== 1}
                onClick={() => {
                  const {
                    id,
                    component: type,
                    y1,
                    y2,
                    options
                  } = state.doc.layers.find(({ id }) =>
                    state.selection.has(id)
                  );
                  measure(
                    { type, height: y2 - y1, options },
                    (width, height) => {
                      setState(
                        current => ({
                          ...current,
                          doc: {
                            ...current.doc,
                            layers: current.doc.layers.map(layer =>
                              layer.id === id
                                ? {
                                    ...layer,
                                    x2: layer.x1 + width
                                  }
                                : layer
                            )
                          }
                        }),
                        true
                      );
                    }
                  );
                }}
                Icon={FitContentWidth}
              >
                Fit content width
              </Button>
              <Button
                disabled={selection.size !== 1}
                onClick={() => {
                  const {
                    id,
                    component: type,
                    x1,
                    x2,
                    options
                  } = state.doc.layers.find(({ id }) =>
                    state.selection.has(id)
                  );
                  measure({ type, width: x2 - x1, options }, (_, height) => {
                    setState(
                      current => ({
                        ...current,
                        doc: {
                          ...current.doc,
                          layers: current.doc.layers.map(layer =>
                            layer.id === id
                              ? {
                                  ...layer,
                                  y2: layer.y1 + height
                                }
                              : layer
                          )
                        }
                      }),
                      true
                    );
                  });
                }}
                Icon={FitContentHeight}
              >
                Fit content height
              </Button>
              <Button
                disabled={selection.size !== 1}
                onClick={() => {
                  const {
                    id,
                    component: type,
                    options
                  } = state.doc.layers.find(({ id }) =>
                    state.selection.has(id)
                  );
                  measure({ type, options }, (width, height) => {
                    setState(
                      current => ({
                        ...current,
                        doc: {
                          ...current.doc,
                          layers: current.doc.layers.map(layer =>
                            layer.id === id
                              ? {
                                  ...layer,
                                  x2: layer.x1 + width,
                                  y2: layer.y1 + height
                                }
                              : layer
                          )
                        }
                      }),
                      true
                    );
                  });
                }}
                Icon={FitContent}
              >
                Fit content
              </Button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, min-content)",
                alignItems: "center",
                justifyItems: "center",
                gap: 6,
                padding: 6
              }}
            >
              {[
                { label: "Fit widest", extreme: "widest" },
                { label: "Fit narrowest", extreme: "narrowest" },
                { label: "Fit tallest", extreme: "tallest" },
                { label: "Fit shortest", extreme: "shortest" }
              ].map(({ label, extreme }) => (
                <Button
                  key={label}
                  disabled={selection.size < 2}
                  onClick={() => {
                    setState(current => ({
                      ...current,
                      doc: {
                        ...current.doc,
                        layers: resizeLayersToExtreme(
                          doc.layers,
                          extreme,
                          ({ id }) => selection.has(id)
                        )
                      }
                    }));
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            <PanelTitle style={{ marginTop: 6 }}>Align</PanelTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, min-content)",
                alignItems: "center",
                justifyItems: "center",
                gap: 6,
                padding: 6
              }}
            >
              {[
                {
                  title: "Align left",
                  icon: AlignLeft,
                  alignment: { x: -1 }
                },
                {
                  title: "Align horizontal middle",
                  icon: AlignHorizontalMiddle,
                  alignment: { x: 0 }
                },
                {
                  title: "Align right",
                  icon: AlignRight,
                  alignment: { x: 1 }
                },
                {
                  title: "Align top",
                  icon: AlignTop,
                  alignment: { y: -1 }
                },
                {
                  title: "Align vertical middle",
                  icon: AlignVerticalMiddle,
                  alignment: { y: 0 }
                },
                {
                  title: "Align bottom",
                  icon: AlignBottom,
                  alignment: { y: 1 }
                }
              ].map(({ title, icon, alignment }) => (
                <Button
                  key={title}
                  disabled={selection.size < 2}
                  onClick={() => {
                    setState(
                      current => ({
                        ...current,
                        doc: {
                          ...current.doc,
                          layers: alignLayers(
                            current.doc.layers,
                            alignment,
                            layer => selection.has(layer.id)
                          )
                        }
                      }),
                      true
                    );
                  }}
                  Icon={icon}
                >
                  {title}
                </Button>
              ))}
            </div>
            <PanelTitle style={{ marginTop: 6 }}>Arrange</PanelTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, min-content)",
                alignItems: "center",
                justifyItems: "center",
                gap: 6,
                padding: 6
              }}
            >
              <Button
                disabled={
                  selection.size !== 1 ||
                  doc.layers.findIndex(({ id }) => id === [...selection][0]) ===
                    doc.layers.length - 1
                }
                onClick={() => {
                  setState(
                    current => ({
                      ...current,
                      doc: {
                        ...current.doc,
                        layers: reorder(
                          current.doc.layers,
                          current.doc.layers.findIndex(
                            ({ id }) => id === [...selection][0]
                          ),
                          current.doc.layers.length - 1
                        )
                      }
                    }),
                    true
                  );
                }}
                Icon={MoveToFront}
              >
                Move to front
              </Button>
              <Button
                disabled={
                  selection.size !== 1 ||
                  doc.layers.findIndex(({ id }) => id === [...selection][0]) ===
                    doc.layers.length - 1
                }
                onClick={() => {
                  setState(
                    current => ({
                      ...current,
                      doc: {
                        ...current.doc,
                        layers: reorder(
                          current.doc.layers,
                          current.doc.layers.findIndex(
                            ({ id }) => id === [...selection][0]
                          ),
                          current.doc.layers.findIndex(
                            ({ id }) => id === [...selection][0]
                          ) + 1
                        )
                      }
                    }),
                    true
                  );
                }}
                Icon={MoveForward}
              >
                Move forward
              </Button>
              <Button
                disabled={
                  selection.size !== 1 ||
                  doc.layers.findIndex(({ id }) => id === [...selection][0]) ===
                    0
                }
                onClick={() => {
                  setState(
                    current => ({
                      ...current,
                      doc: {
                        ...current.doc,
                        layers: reorder(
                          current.doc.layers,
                          current.doc.layers.findIndex(
                            ({ id }) => id === [...selection][0]
                          ),
                          current.doc.layers.findIndex(
                            ({ id }) => id === [...selection][0]
                          ) - 1
                        )
                      }
                    }),
                    true
                  );
                }}
                Icon={MoveBackward}
              >
                Move backward
              </Button>
              <Button
                disabled={
                  selection.size !== 1 ||
                  doc.layers.findIndex(({ id }) => id === [...selection][0]) ===
                    0
                }
                onClick={() => {
                  setState(
                    current => ({
                      ...current,
                      doc: {
                        ...current.doc,
                        layers: reorder(
                          current.doc.layers,
                          current.doc.layers.findIndex(
                            ({ id }) => id === [...selection][0]
                          ),
                          0
                        )
                      }
                    }),
                    true
                  );
                }}
                Icon={MoveToBack}
              >
                Move to back
              </Button>
            </div>
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
                config[
                  doc.layers.find(({ id }) => id === [...selection][0])
                    .component
                ].options?.map(({ key, input, label }, index) => {
                  const layer = doc.layers.find(
                    ({ id }) => id === [...selection][0]
                  );
                  const error = config[layer.component]
                    .validate(layer.options)
                    ?.filter(error => error.key === key)
                    .find(() => true);
                  switch (input) {
                    case "short-string":
                      return (
                        <Fragment key={key}>
                          {error ? (
                            <OptionsErrorMessage
                              style={{
                                paddingTop: index === 0 ? "4px" : "0px",
                                paddingLeft: "6px"
                              }}
                            >
                              {error.message}
                            </OptionsErrorMessage>
                          ) : null}
                          <div
                            id={`option-${key}`}
                            type="text"
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(1, min-content 1fr)",
                              alignItems: "center",
                              justifyItems: "center",
                              gap: 6,
                              padding: 6
                            }}
                          >
                            <Label htmlFor={`option-${key}`}>{label}</Label>
                            <Input
                              key={key}
                              id={`option-${key}`}
                              type="text"
                              value={
                                doc.layers.find(
                                  ({ id }) => id === [...selection][0]
                                ).options[key]
                              }
                              onChange={({ currentTarget: { value } }) => {
                                setState(current => ({
                                  ...current,
                                  doc: {
                                    layers: current.doc.layers.map(layer =>
                                      layer.id === [...selection][0]
                                        ? {
                                            ...layer,
                                            options: {
                                              ...layer.options,
                                              [key]: value
                                            }
                                          }
                                        : layer
                                    )
                                  }
                                }));
                              }}
                            />
                          </div>
                        </Fragment>
                      );
                    case "long-string":
                      return (
                        <Fragment key={key}>
                          {error ? (
                            <OptionsErrorMessage
                              style={{
                                paddingTop: index === 0 ? "4px" : "0px",
                                paddingLeft: "6px"
                              }}
                            >
                              {error.message}
                            </OptionsErrorMessage>
                          ) : null}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(1, min-content 1fr)",
                              alignItems: "center",
                              justifyItems: "center",
                              gap: 6,
                              padding: 6
                            }}
                          >
                            <Label htmlFor={`option-${key}`}>{label}</Label>
                            <Textarea
                              key={key}
                              id={`option-${key}`}
                              type="text"
                              style={{
                                minHeight: "8em"
                              }}
                              value={
                                doc.layers.find(
                                  ({ id }) => id === [...selection][0]
                                ).options[key]
                              }
                              onChange={({ currentTarget: { value } }) => {
                                setState(current => ({
                                  ...current,
                                  doc: {
                                    layers: current.doc.layers.map(layer =>
                                      layer.id === [...selection][0]
                                        ? {
                                            ...layer,
                                            options: {
                                              ...layer.options,
                                              [key]: value
                                            }
                                          }
                                        : layer
                                    )
                                  }
                                }));
                              }}
                            />
                          </div>
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                }) ?? (
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
          </>
        )}
      </div>
    </div>
  );
};

export default Editor;
