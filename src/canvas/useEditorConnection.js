import { useState, useEffect } from "react";
import pushID from "../pushID";

const useEditorConnection = (editorWindow, canvasWindow) => {
  const [layersToRender, setLayersToRender] = useState([]);
  const [layersToMeasure, setLayersToMeasure] = useState([]);
  const [sketchbookRequestMeasureId, setSketchbookRequestMeasureId] = useState(
    undefined
  );

  useEffect(() => {
    const receiveMessage = event => {
      switch (event.data.type) {
        case "sketchbook_request:ping": {
          postSketchbookMessageAcknowledge();
          break;
        }
        case "sketchbook_request:render": {
          postSketchbookMessageAcknowledge();
          setLayersToRender(event.data.layers);
          break;
        }
        case "sketchbook_request:measure": {
          setSketchbookRequestMeasureId(event.data.id);
          setLayersToMeasure(current => [...current, event.data.layer]);
          break;
        }
        default:
          break;
      }

      function postSketchbookMessageAcknowledge() {
        editorWindow.postMessage(
          {
            type: "sketchbook_response:acknowledge",
            id: pushID(),
            request: event.data.id,
            status: "ready"
          },
          "*"
        );
      }
    };
    canvasWindow.addEventListener("message", receiveMessage);
    return () => {
      canvasWindow.removeEventListener("message", receiveMessage);
    };
  }, [
    setLayersToRender,
    setLayersToMeasure,
    canvasWindow,
    editorWindow,
    sketchbookRequestMeasureId
  ]);

  return {
    layersToRender,
    layersToMeasure,
    sendMeasurements: ({ id, width, height }) => {
      editorWindow.postMessage(
        {
          type: "sketchbook_response:measure",
          id,
          request: sketchbookRequestMeasureId,
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
