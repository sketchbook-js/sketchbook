import React, { useCallback } from "react";

const Layer = ({
  id,
  type,
  name,
  width,
  height,
  options,
  render,
  onRender
}) => {
  const ref = useCallback(
    element => {
      if (element) {
        render({
          element,
          id,
          type,
          name,
          width,
          height,
          options
        });
        if (onRender) onRender(element.getBoundingClientRect());
      }
    },
    [render, id, type, name, width, height, options, onRender]
  );
  return <div ref={ref} />;
};

export default Layer;
