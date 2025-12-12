import { useState, useEffect } from "react";

import pushID from "../pushID";

const useCanvasStatus = (editorWindow, canvasRef) => {
  const [status, setStatus] = useState("unknown");
  useEffect(() => {
    const messageRequestId = pushID();
    const interval = setInterval(() => {
      if (!canvasRef.current) throw Error("No canvas");
      canvasRef.current.contentWindow.postMessage(
        {
          type: "sketchbook_request:ping",
          id: messageRequestId
        },
        "*"
      );
    }, 100);
    const receiveMessage = ({
      data: { type: eventType, request: eventRequest, status: messageStatus }
    }) => {
      if (
        eventType === "sketchbook_response:acknowledge" &&
        eventRequest === messageRequestId
      ) {
        clearInterval(interval);
        setStatus(messageStatus);
      }
    };
    editorWindow.addEventListener("message", receiveMessage);
    return () => {
      clearInterval(interval);
      editorWindow.removeEventListener("message", receiveMessage);
    };
  }, [canvasRef, editorWindow, status]);
  return status;
};

const useCanvasRender = ({ editorWindow, status, canvasRef, layers }) => {
  useEffect(() => {
    const messageRequestId = pushID();
    if (status === "ready") {
      if (!canvasRef.current) throw Error("No canvas");
      canvasRef.current.contentWindow.postMessage(
        {
          type: "sketchbook_request:render",
          id: messageRequestId,
          layers
        },
        "*"
      );
    }
    const receiveMessage = ({
      data: { type: eventType, request: eventRequest }
    }) => {
      if (
        eventType === "sketchbook_response:acknowledge" &&
        eventRequest === messageRequestId
      ) {
      }
    };
    editorWindow.addEventListener("message", receiveMessage);
    return () => {
      editorWindow.removeEventListener("message", receiveMessage);
    };
  }, [status, canvasRef, layers, editorWindow]);
};

const useCanvasMeasure = (status, editorWindow, canvasRef) => {
  return ({ type, component, width, height, options }) => {
    return new Promise((resolve, reject) => {
      if (status === "ready" && canvasRef.current) {
        const messageRequestId = pushID();
        const receiveMessage = event => {
          if (
            event.data.type === "sketchbook_response:measure" &&
            event.data.request === messageRequestId
          ) {
            resolve({ width: event.data.width, height: event.data.height });
            editorWindow.removeEventListener("message", receiveMessage);
          }
        };
        editorWindow.addEventListener("message", receiveMessage);
        canvasRef.current.contentWindow.postMessage(
          {
            type: "sketchbook_request:measure",
            id: messageRequestId,
            layer: {
              id: pushID(),
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
  useCanvasRender({ editorWindow, status, canvasRef, layers });
  const measureLayer = useCanvasMeasure(status, editorWindow, canvasRef);
  return {
    measureLayer
  };
};

export default useCanvasConnection;
