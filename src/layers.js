const transformLayers = (layers, transform, predicate = () => true) => {
  const bounds = getLayerBounds(layers, predicate);
  const width = bounds.x2 - bounds.x1;
  const height = bounds.y2 - bounds.y1;
  const origin = {
    x: bounds.x1 + width * (transform.cx ?? 0),
    y: bounds.y1 + height * (transform.cy ?? 0)
  };
  return layers.map(layer =>
    predicate(layer)
      ? {
          ...layer,
          ...transformBounds(
            [
              // set origin
              {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: -origin.x,
                f: -origin.y
              },
              // scale
              {
                a:
                  transform.w === undefined
                    ? 1
                    : Math.max(
                        (transform.relative ? width : 0) + transform.w,
                        1
                      ) / width,
                b: 0,
                c: 0,
                d:
                  transform.h === undefined
                    ? 1
                    : Math.max(
                        (transform.relative ? height : 0) + transform.h,
                        1
                      ) / height,
                e: 0,
                f: 0
              },
              // translate
              {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e:
                  transform.x === undefined
                    ? 0
                    : transform.x - (transform.relative ? 0 : bounds.x1),
                f:
                  transform.y === undefined
                    ? 0
                    : transform.y - (transform.relative ? 0 : bounds.y1)
              },
              // reset origin
              {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: origin.x,
                f: origin.y
              }
            ],
            layer
          )
        }
      : layer
  );
};

// TODO: This would be could be a little more "simple" if the x and y values
// were between 0 and 1 instead of -1 and 1. It'd work like the cx and cy
// values in the transformLayers() function.
const alignLayers = (layers, { x, y }, predicate = () => true) => {
  const bounds = getLayerBounds(layers, predicate);
  return layers.map(layer =>
    predicate(layer)
      ? {
          ...layer,
          ...transformBounds(
            [
              {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e:
                  x === 0
                    ? bounds.x1 +
                      (bounds.x2 - bounds.x1) / 2 -
                      (layer.x2 - layer.x1) / 2 -
                      layer.x1
                    : x === -1
                    ? bounds.x1 - layer.x1
                    : x === 1
                    ? bounds.x2 - layer.x2
                    : 0,
                f:
                  y === 0
                    ? bounds.y1 +
                      (bounds.y2 - bounds.y1) / 2 -
                      (layer.y2 - layer.y1) / 2 -
                      layer.y1
                    : y === -1
                    ? bounds.y1 - layer.y1
                    : y === 1
                    ? bounds.y2 - layer.y2
                    : 0
              }
            ],
            layer
          )
        }
      : layer
  );
};

// TODO: Rename this getSelectionBounds?
const getLayerBounds = (layers, predicate = () => true) =>
  layers.filter(predicate).length > 0
    ? layers.filter(predicate).reduce(
        (bounds, layer) => ({
          x1: Math.min(layer.x1, bounds.x1),
          y1: Math.min(layer.y1, bounds.y1),
          x2: Math.max(layer.x2, bounds.x2),
          y2: Math.max(layer.y2, bounds.y2)
        }),
        {
          x1: Number.POSITIVE_INFINITY,
          y1: Number.POSITIVE_INFINITY,
          x2: Number.NEGATIVE_INFINITY,
          y2: Number.NEGATIVE_INFINITY
        }
      )
    : { x1: 0, y1: 0, x2: 0, y2: 0 };

const transformBounds = (matrices, { x1, y1, x2, y2 }) => {
  const points = transformPoints(matrices, [
    [x1, y1],
    [x2, y2]
  ]);
  return {
    x1: points[0][0],
    y1: points[0][1],
    x2: points[1][0],
    y2: points[1][1]
  };
};

const transformPoints = (matrices, points) =>
  points.map(point =>
    matrices.reduce(
      (result, matrix) => [
        matrix.a * result[0] + matrix.c * result[1] + matrix.e,
        matrix.b * result[0] + matrix.d * result[1] + matrix.f
      ],
      point
    )
  );

const getExtremeBounds = (layers, extreme, predicate = () => true) => {
  if (layers.length === 0) return null;
  const filteredLayers = layers.filter(predicate);
  switch (extreme) {
    case "widest":
      return filteredLayers.reduce(
        (result, { x1, x2 }) =>
          x2 - x1 > result.x2 - result.x1 ? { x1, x2 } : result,
        { x1: 0, x2: 0 }
      );
    case "narrowest":
      return filteredLayers.reduce(
        (result, { x1, x2 }) =>
          x2 - x1 < result.x2 - result.x1 ? { x1, x2 } : result,
        { x1: 0, x2: Infinity }
      );
    case "tallest":
      return filteredLayers.reduce(
        (result, { y1, y2 }) =>
          y2 - y1 > result.y2 - result.y1 ? { y1, y2 } : result,
        { y1: 0, y2: 0 }
      );
    case "shortest":
      return filteredLayers.reduce(
        (result, { y1, y2 }) =>
          y2 - y1 < result.y2 - result.y1 ? { y1, y2 } : result,
        { y1: 0, y2: Infinity }
      );
    default:
      return null;
  }
};

const resizeLayersToExtreme = (layers, extreme, predicate = () => true) => {
  const extremeBounds = getExtremeBounds(layers, extreme, predicate);
  return extremeBounds
    ? layers.map(layer =>
        predicate(layer)
          ? {
              ...layer,
              ...extremeBounds
            }
          : layer
      )
    : layers;
};

export {
  transformLayers,
  alignLayers,
  getLayerBounds,
  transformBounds,
  transformPoints,
  getExtremeBounds,
  resizeLayersToExtreme
};
