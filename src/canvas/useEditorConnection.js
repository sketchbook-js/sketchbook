import { useState, useEffect } from "react";

const useEditorConnection = (editorWindow, canvasWindow) => {
  const [layersToRender, setLayersToRender] = useState([]);
  const [layersToMeasure, setLayersToMeasure] = useState([]);
  useEffect(() => {
    const receiveMessage = event => {
      switch (event.data.type) {
        case "sketchbook_status_request": {
          editorWindow.postMessage(
            {
              type: "sketchbook_status_response",
              status: "ready"
            },
            "*"
          );
          break;
        }
        case "sketchbook_render_layers_request": {
          setLayersToRender(event.data.layers);
          break;
        }
        case "sketchbook_measure_layer_request": {
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
          type: "sketchbook_measure_layer_response",
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
