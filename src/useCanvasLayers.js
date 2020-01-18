import React, { useState, useEffect, useRef } from "react";

const Measure = ({ Component, props, onMeasure }) => {
  const ref = useRef(null);
  useEffect(() => {
    const { width, height } = ref.current.getBoundingClientRect();
    onMeasure({ width, height });
  }, [onMeasure]);
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <Component {...props} />
    </div>
  );
};

const useCanvasLayers = config => {
  const [layersToRender, setLayersToRender] = useState([]);
  const [layersToMeasure, setLayersToMeasure] = useState([]);
  useEffect(() => {
    const receiveMessage = event => {
      switch (event.data.type) {
        case "sketchbook_update_render_layers": {
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
    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [setLayersToRender, setLayersToMeasure]);
  return [
    ...layersToRender.map(
      ({ id, type, x, y, scale, width, height, options }) => ({
        Component: config[type].render,
        id,
        x,
        y,
        scale,
        width,
        height,
        options
      })
    ),
    ...layersToMeasure.map(layer => ({
      Component: props => (
        <Measure
          Component={config[layer.type].render}
          props={props}
          onMeasure={({ width, height }) => {
            window.top.postMessage(
              {
                type: "sketchbook_measure_layer_response",
                id: layer.id,
                width,
                height
              },
              "*"
            );
            setLayersToMeasure(current =>
              current.filter(({ id }) => id !== layer.id)
            );
          }}
        />
      ),
      id: layer.id,
      x: 100_000,
      y: 100_000,
      scale: 1,
      width: layer.width,
      height: layer.height,
      options: layer.options
    }))
  ];
};

export default useCanvasLayers;
