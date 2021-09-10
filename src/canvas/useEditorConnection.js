import { useState, useEffect } from "react";

const useEditorConnection = (editorWindow, canvasWindow) => {
  const [layersToRender, setLayersToRender] = useState([]);
  const [layersToMeasure, setLayersToMeasure] = useState([]);
  useEffect(() => {
    const receiveMessage = event => {
      switch (event.data.type) {
        case "sketchbook_request:ping": {
          editorWindow.postMessage(
            {
              type: "sketchbook_response:acknowledge",
              status: "ready"
            },
            "*"
          );
          break;
        }
        case "sketchbook_request:render": {
          setLayersToRender(event.data.layers);
          break;
        }
        case "sketchbook_request:measure": {
          setLayersToMeasure(current => [...current, event.data.layer]);
          break;
        }
        default:
          break;
      }
    };
    canvasWindow.addEventListener("message", receiveMessage);
    return () => {
      canvasWindow.removeEventListener("message", receiveMessage);
    };
  }, [setLayersToRender, setLayersToMeasure, canvasWindow, editorWindow]);
  return {
    layersToRender,
    layersToMeasure,
    sendMeasurements: ({ id, width, height }) => {
      editorWindow.postMessage(
        {
          type: "sketchbook_response:measure",
          id,
          width,
          height
        },
        "*"
      );
      setLayersToMeasure(current => current.filter(layer => id !== layer.id));
    }
  };
};

export default useEditorConnection;
