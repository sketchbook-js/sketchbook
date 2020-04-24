import { useState, useEffect } from "react";

import pushID from "../pushID";

const useCanvasStatus = (editorWindow, canvasRef) => {
  const [status, setStatus] = useState("unknown");
  useEffect(() => {
    const interval = setInterval(() => {
      if (!canvasRef.current) throw Error("No canvas");
      canvasRef.current.contentWindow.postMessage(
        {
          type: "sketchbook_status_request"
        },
        "*"
      );
    }, 100);
    const receiveMessage = event => {
      if (event.data.type === "sketchbook_status_response") {
        clearInterval(interval);
        editorWindow.removeEventListener("message", receiveMessage);
        setStatus(event.data.status);
      }
    };
    editorWindow.addEventListener("message", receiveMessage);
    return () => {
      clearInterval(interval);
      editorWindow.removeEventListener("message", receiveMessage);
    };
  }, [canvasRef, editorWindow]);
  return status;
};

const useCanvasRender = (status, canvasRef, layers) => {
  useEffect(() => {
    if (status === "ready") {
      if (!canvasRef.current) throw Error("No canvas");
      canvasRef.current.contentWindow.postMessage(
        {
          type: "sketchbook_render_layers_request",
          layers
        },
        "*"
      );
    }
  }, [status, canvasRef, layers]);
};

const useCanvasMeasure = (status, editorWindow, canvasRef) => {
  return ({ type, component, width, height, options }) => {
    return new Promise((resolve, reject) => {
      if (status === "ready" && canvasRef.current) {
        const id = pushID();
        const receiveMessage = event => {
          if (
            event.data.type === "sketchbook_measure_layer_response" &&
            event.data.id === id
          ) {
            resolve({ width: event.data.width, height: event.data.height });
            editorWindow.removeEventListener("message", receiveMessage);
          }
        };
        editorWindow.addEventListener("message", receiveMessage);
        canvasRef.current.contentWindow.postMessage(
          {
            type: "sketchbook_measure_layer_request",
            layer: {
              id,
              type,
              component,
              width,
              height,
              options
            }
          },
          "*"
        );
      } else {
        reject();
      }
    });
  };
};

const useCanvasConnection = (editorWindow, canvasRef, layers) => {
  const status = useCanvasStatus(editorWindow, canvasRef);
  useCanvasRender(status, canvasRef, layers);
  const measureLayer = useCanvasMeasure(status, editorWindow, canvasRef);
  return { measureLayer };
};

export default useCanvasConnection;
