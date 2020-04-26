import React, { Fragment, useState, useRef } from "react";
import { set, or, not, and } from "set-fns";
import useStateSnapshots from "use-state-snapshots";
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";

import InfoPanel from "./components/InfoPanel";

import useCanvasConnection from "./editor/useCanvasConnection";
import exampleDoc from "./editor/exampleDoc";
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

const transformSelection = (current, transform) => ({
  ...current,
  doc: {
    ...current.doc,
    layers: transformLayers(current.doc.layers, transform, layer =>
      current.selection.has(layer.id)
    )
  }
});

const Editor = ({ config }) => {
  const canvas = useRef(null);
  const [elementBeingDraggedId, setElementBeingDraggedId] = useState(null);
  const [idOfLayerBeingEdited, setIdOfLayerBeingEdited] = useState(null);
  const [state, setState, pointer, setPointer, snapshots] = useStateSnapshots(
    {
      doc: exampleDoc,
      selection: set(),
      viewport: {
        x: 0,
        y: 0,
        scale: 1
      },
      input: {
        mode: "up", // "up", "down", "drag", "select", "pan" or "resize"
        mouseX: 0,
        mouseY: 0,
        clickX: 0,
        clickY: 0,
        shiftKey: false,
        spaceKey: false
      }
    },
    false,
    100
  );
  const { doc, selection, viewport } = state;
  const selectionBounds = getLayerBounds(
    doc.layers.filter(layer => selection.has(layer.id))
  );
  useKeys({
    keydown: event => {
      const { shiftKey } = event;
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
          setState(current => ({
            ...transformSelection(current, {
              x: shiftKey ? -10 : -1,
              relative: true
            }),
            input: {
              ...current.input,
              shiftKey
            }
          }));
          break;
        case "ArrowUp":
          setState(current => ({
            ...transformSelection(current, {
              y: shiftKey ? -10 : -1,
              relative: true
            }),
            input: {
              ...current.input,
              shiftKey
            }
          }));
          break;
        case "ArrowRight":
          setState(current => ({
            ...transformSelection(current, {
              x: shiftKey ? 10 : 1,
              relative: true
            }),
            input: {
              ...current.input,
              shiftKey
            }
          }));
          break;
        case "ArrowDown":
          setState(current => ({
            ...transformSelection(current, {
              y: shiftKey ? 10 : 1,
              relative: true
            }),
            input: {
              ...current.input,
              shiftKey
            }
          }));
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
              selection: set(),
              input: {
                ...current.input,
                shiftKey
              }
            }),
            true
          );
          break;
        case "Space":
          setState(current => ({
            ...current,
            input: {
              ...current.input,
              spaceKey: true,
              shiftKey
            }
          }));
          break;
        default:
          setState(current => ({
            ...current,
            input: {
              ...current.input,
              shiftKey
            }
          }));
          break;
      }
    },
    keyup: ({ code, shiftKey }) => {
      setState(current => ({
        ...current,
        input: {
          ...current.input,
          spaceKey: code === "Space" ? false : current.input.spaceKey,
          shiftKey
        }
      }));
    }
  });
  const mouseIsWithinSelection =
    state.input.mouseX >= selectionBounds.x1 - 3 &&
    state.input.mouseX <= selectionBounds.x2 + 3 &&
    state.input.mouseY >= selectionBounds.y1 - 3 &&
    state.input.mouseY <= selectionBounds.y2 + 3;
  const mouseIsOverSelectionLeft =
    mouseIsWithinSelection && state.input.mouseX <= selectionBounds.x1 + 3;
  const mouseIsOverSelectionRight =
    mouseIsWithinSelection && state.input.mouseX >= selectionBounds.x2 - 3;
  const mouseIsOverSelectionTop =
    mouseIsWithinSelection && state.input.mouseY <= selectionBounds.y1 + 3;
  const mouseIsOverSelectionBottom =
    mouseIsWithinSelection && state.input.mouseY >= selectionBounds.y2 - 3;
  const mouseStartedWithinSelection =
    state.input.clickX >= selectionBounds.x1 - 3 &&
    state.input.clickX <= selectionBounds.x2 + 3 &&
    state.input.clickY >= selectionBounds.y1 - 3 &&
    state.input.clickY <= selectionBounds.y2 + 3;
  const mouseStartedOverSelectionLeft =
    mouseStartedWithinSelection && state.input.clickX <= selectionBounds.x1 + 3;
  const mouseStartedOverSelectionRight =
    mouseStartedWithinSelection && state.input.clickX >= selectionBounds.x2 - 3;
  const mouseStartedOverSelectionTop =
    mouseStartedWithinSelection && state.input.clickY <= selectionBounds.y1 + 3;
  const mouseStartedOverSelectionBottom =
    mouseStartedWithinSelection && state.input.clickY >= selectionBounds.y2 - 3;
  const lockedAxis = state.input.shiftKey
    ? Math.abs(state.input.mouseX - state.input.clickX) >
      Math.abs(state.input.mouseY - state.input.clickY)
      ? "x"
      : "y"
    : null;
  let transformedLayers = state.doc.layers;
  // TODO: Filter out layers that don't intersect the viewport using canvas.current.getBoundingClientRect()
  switch (state.input.mode) {
    case "resize":
      transformedLayers = transformLayers(
        transformedLayers,
        {
          w:
            mouseStartedOverSelectionLeft || mouseStartedOverSelectionRight
              ? (state.input.mouseX - state.input.clickX) *
                (mouseStartedOverSelectionLeft ? -1 : 1)
              : undefined,
          h:
            mouseStartedOverSelectionTop || mouseStartedOverSelectionBottom
              ? (state.input.mouseY - state.input.clickY) *
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
          x: lockedAxis === "y" ? 0 : state.input.mouseX - state.input.clickX,
          y: lockedAxis === "x" ? 0 : state.input.mouseY - state.input.clickY,
          relative: true
        },
        layer => state.selection.has(layer.id)
      );
      break;
    case "pan":
      transformedLayers = transformLayers(transformedLayers, {
        x: state.input.mouseX - state.input.clickX,
        y: state.input.mouseY - state.input.clickY,
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
      ({ id, type, component, name, x1, y1, x2, y2, options }) => ({
        id,
        type,
        component,
        name,
        x: x1,
        y: y1,
        scale: viewport.scale,
        width: x2 - x1,
        height: y2 - y1,
        options
      })
    )
  };
  const { measureLayer } = useCanvasConnection(window, canvas, display.layers);
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
                selection: current.selection.has(draggableId)
                  ? current.selection
                  : set([draggableId])
              };
            });
          }}
          onDragEnd={result => {
            const { destination, source } = result;

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
                  [
                    source.index,
                    ...current.doc.layers
                      .map(({ id }, index) => ({ id, index }))
                      .filter(
                        ({ id, index }) =>
                          selection.has(id) && index !== source.index
                      )
                      .map(({ index }) => index)
                  ] || source.index,
                  destination.index
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
                      const { shiftKey } = event;
                      event.stopPropagation();
                      setState(
                        current => ({
                          ...current,
                          selection: shiftKey
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
            state.input.mode === "pan"
              ? "grabbing"
              : state.input.spaceKey
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
          state.input.mode === "up"
            ? ({ clientX, clientY }) => {
                const rect = canvas.current.getBoundingClientRect();
                const x = clientX - rect.x - viewport.x;
                const y = clientY - rect.y - viewport.y;
                setState(current => ({
                  ...current,
                  input: {
                    ...current.input,
                    mode: "down",
                    mouseX: x,
                    mouseY: y,
                    clickX: x,
                    clickY: y
                  }
                }));
              }
            : null
        }
        onMouseMove={({ clientX, clientY, shiftKey }) => {
          const rect = canvas.current.getBoundingClientRect();
          const x = clientX - rect.x - viewport.x;
          const y = clientY - rect.y - viewport.y;
          setState(current => ({
            ...current,
            input: {
              ...current.input,
              mouseX: clientX - rect.x - viewport.x,
              mouseY: clientY - rect.y - viewport.y
            }
          }));
          if (state.input.mode === "down") {
            const dx = x - state.input.clickX;
            const dy = y - state.input.clickY;
            const distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
            if (distance > 1) {
              if (state.input.spaceKey) {
                setState(current => ({
                  ...current,
                  input: {
                    ...current.input,
                    mode: "pan"
                  }
                }));
              } else if (
                mouseStartedOverSelectionLeft ||
                mouseStartedOverSelectionRight ||
                mouseStartedOverSelectionTop ||
                mouseStartedOverSelectionBottom
              ) {
                setState(current => ({
                  ...current,
                  input: {
                    ...current.input,
                    mode: "resize"
                  }
                }));
              } else if (
                selectionBounds.x1 < state.input.clickX &&
                selectionBounds.x2 > state.input.clickX &&
                selectionBounds.y1 < state.input.clickY &&
                selectionBounds.y2 > state.input.clickY
              ) {
                setState(current => ({
                  ...current,
                  input: {
                    ...current.input,
                    mode: "drag"
                  }
                }));
              } else {
                const layersUnderClick = doc.layers.filter(
                  layer =>
                    layer.x1 < state.input.clickX &&
                    layer.x2 > state.input.clickX &&
                    layer.y1 < state.input.clickY &&
                    layer.y2 > state.input.clickY
                );
                if (layersUnderClick.length > 0) {
                  const clickedLayer =
                    layersUnderClick[layersUnderClick.length - 1];
                  setState(
                    current => ({
                      ...current,
                      selection: shiftKey
                        ? current.selection.has(clickedLayer.id)
                          ? not(current.selection, [clickedLayer.id])
                          : or(current.selection, [clickedLayer.id])
                        : set([clickedLayer.id]),
                      input: {
                        ...current.input,
                        mode: "drag"
                      }
                    }),
                    true
                  );
                } else {
                  setState(current => ({
                    ...current,
                    input: {
                      ...current.input,
                      mode: "select"
                    }
                  }));
                }
              }
            }
          }
        }}
        onMouseUp={
          state.input.mode !== "up"
            ? ({ clientX, clientY, shiftKey }) => {
                if (state.input.mode === "down") {
                  const layersUnderClick = doc.layers.filter(
                    layer =>
                      layer.x1 < state.input.mouseX &&
                      layer.x2 > state.input.mouseX &&
                      layer.y1 < state.input.mouseY &&
                      layer.y2 > state.input.mouseY
                  );
                  if (layersUnderClick.length > 0) {
                    const clickedLayer =
                      layersUnderClick[layersUnderClick.length - 1];
                    setState(
                      current => ({
                        ...current,
                        selection: shiftKey
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
                } else if (state.input.mode === "drag") {
                  setState(current =>
                    transformSelection(current, {
                      x:
                        lockedAxis === "y"
                          ? 0
                          : state.input.mouseX - state.input.clickX,
                      y:
                        lockedAxis === "x"
                          ? 0
                          : state.input.mouseY - state.input.clickY,
                      relative: true
                    })
                  );
                } else if (state.input.mode === "select") {
                  const x1 = Math.min(state.input.clickX, state.input.mouseX);
                  const y1 = Math.min(state.input.clickY, state.input.mouseY);
                  const x2 = Math.max(state.input.clickX, state.input.mouseX);
                  const y2 = Math.max(state.input.clickY, state.input.mouseY);
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
                } else if (state.input.mode === "pan") {
                  setState(current => ({
                    ...current,
                    viewport: {
                      ...current.viewport,
                      x:
                        current.viewport.x +
                        (state.input.mouseX - state.input.clickX),
                      y:
                        current.viewport.y +
                        (state.input.mouseY - state.input.clickY)
                    }
                  }));
                } else if (state.input.mode === "resize") {
                  setState(current =>
                    transformSelection(current, {
                      w:
                        mouseStartedOverSelectionLeft ||
                        mouseStartedOverSelectionRight
                          ? selectionBounds.x2 -
                            selectionBounds.x1 +
                            (state.input.mouseX - state.input.clickX) *
                              (mouseStartedOverSelectionLeft ? -1 : 1)
                          : undefined,
                      h:
                        mouseStartedOverSelectionTop ||
                        mouseStartedOverSelectionBottom
                          ? selectionBounds.y2 -
                            selectionBounds.y1 +
                            (state.input.mouseY - state.input.clickY) *
                              (mouseStartedOverSelectionTop ? -1 : 1)
                          : undefined,
                      cx: mouseStartedOverSelectionLeft ? 1 : 0,
                      cy: mouseStartedOverSelectionTop ? 1 : 0
                    })
                  );
                }
                setState(current => ({
                  ...current,
                  input: {
                    ...current.input,
                    mode: "up"
                  }
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
            height: "100%",
            width: "100%"
          }}
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
          {state.input.mode === "up"
            ? [
                doc.layers
                  .filter(
                    ({ x1, y1, x2, y2 }) =>
                      state.input.mouseX >= x1 &&
                      state.input.mouseX <= x2 &&
                      state.input.mouseY >= y1 &&
                      state.input.mouseY <= y2
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
                      (state.input.mode === "drag"
                        ? state.input.mouseX - state.input.clickX
                        : 0) +
                      0.5
                    }
                    y={
                      y1 +
                      viewport.y +
                      (state.input.mode === "drag"
                        ? state.input.mouseY - state.input.clickY
                        : 0) +
                      0.5
                    }
                    width={x2 - x1 - 1}
                    height={y2 - y1 - 1}
                  />
                ))
            : null}
          {state.input.mode === "select" ? (
            <rect
              stroke="#f0f"
              strokeWidth={1}
              strokeDasharray={[1, 2]}
              x={
                viewport.x +
                Math.min(state.input.clickX, state.input.mouseX) +
                0.5
              }
              y={
                viewport.y +
                Math.min(state.input.clickY, state.input.mouseY) +
                0.5
              }
              width={Math.max(
                Math.max(state.input.clickX, state.input.mouseX) -
                  Math.min(state.input.clickX, state.input.mouseX) -
                  1,
                0
              )}
              height={Math.max(
                Math.max(state.input.clickY, state.input.mouseY) -
                  Math.min(state.input.clickY, state.input.mouseY) -
                  1,
                0
              )}
            />
          ) : null}
        </svg>
        <div
          style={{
            pointerEvents: "none",
            userSelect: "none",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "#eee9"
          }}
        >
          <InfoPanel
            mouse={{
              status: state.input.mode,
              x: state.input.mouseX,
              y: state.input.mouseY
            }}
            viewport={viewport}
            keys={
              new Set(
                [
                  state.input.shiftKey ? "Shift" : null,
                  state.input.spaceKey ? "Space" : null
                ].filter(Boolean)
              )
            }
          />
        </div>
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
              {config.components.map(component => (
                <Button
                  key={component.type}
                  onClick={async () => {
                    const id = pushID();
                    const initial = component.init && component.init();
                    const { width, height } = await measureLayer({
                      type: "SketchbookComponent",
                      component: component.type,
                      ...initial
                    });
                    setState(
                      current => ({
                        ...current,
                        doc: {
                          ...current.doc,
                          layers: [
                            ...current.doc.layers,
                            {
                              id,
                              type: "SketchbookComponent",
                              component: component.type,
                              name: initial?.name ?? component.type,
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
                  }}
                >
                  {component.type}
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
                  setState(current =>
                    transformSelection(current, {
                      x: parseInt(value || 0, 10)
                    })
                  );
                }}
              />
              <Label htmlFor="info-panel-y">Y</Label>
              <Input
                id="info-panel-y"
                type="number"
                value={Math.round(selectionBounds.y1)}
                onChange={({ currentTarget: { value } }) => {
                  setState(current =>
                    transformSelection(current, {
                      y: parseInt(value || 0, 10)
                    })
                  );
                }}
              />
              <Label htmlFor="info-panel-w">W</Label>
              <Input
                type="number"
                value={Math.round(selectionBounds.x2 - selectionBounds.x1)}
                onChange={({ currentTarget: { value } }) => {
                  setState(current =>
                    transformSelection(current, {
                      w: parseInt(value || 0, 10)
                    })
                  );
                }}
              />
              <Label htmlFor="info-panel-h">H</Label>
              <Input
                type="number"
                value={Math.round(selectionBounds.y2 - selectionBounds.y1)}
                onChange={({ currentTarget: { value } }) => {
                  setState(current =>
                    transformSelection(current, {
                      h: parseInt(value || 0, 10)
                    })
                  );
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
                onClick={async () => {
                  const {
                    id,
                    component,
                    y1,
                    y2,
                    options
                  } = state.doc.layers.find(({ id }) =>
                    state.selection.has(id)
                  );
                  const { width } = await measureLayer({
                    type: "SketchbookComponent",
                    component,
                    height: y2 - y1,
                    options
                  });
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
                }}
                Icon={FitContentWidth}
              >
                Fit content width
              </Button>
              <Button
                disabled={selection.size !== 1}
                onClick={async () => {
                  const {
                    id,
                    component,
                    x1,
                    x2,
                    options
                  } = state.doc.layers.find(({ id }) =>
                    state.selection.has(id)
                  );
                  const { height } = await measureLayer({
                    type: "SketchbookComponent",
                    component,
                    width: x2 - x1,
                    options
                  });
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
                }}
                Icon={FitContentHeight}
              >
                Fit content height
              </Button>
              <Button
                disabled={selection.size !== 1}
                onClick={async () => {
                  const {
                    id,
                    component,
                    options
                  } = state.doc.layers.find(({ id }) =>
                    state.selection.has(id)
                  );
                  const { width, height } = await measureLayer({
                    type: "SketchbookComponent",
                    component,
                    options
                  });
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
                config.components
                  .find(
                    ({ type }) =>
                      type ===
                      doc.layers.find(({ id }) => selection.has(id)).component
                  )
                  .options?.map(({ key, input, label }, index) => {
                    const layer = doc.layers.find(({ id }) =>
                      selection.has(id)
                    );
                    const error = config.components
                      .find(({ type }) => type === layer.component)
                      .validate?.(layer.options)
                      ?.filter(error => error.key === key)
                      .find(() => true);
                    switch (input.type) {
                      case "String":
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
                                gridTemplateColumns:
                                  "repeat(1, min-content 1fr)",
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
                      case "PlainText":
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
                                gridTemplateColumns:
                                  "repeat(1, min-content 1fr)",
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
