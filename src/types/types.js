export type TypeLayer = {
  id: number,
  type: string,
  component: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options?: { [string]: string }
};

export type TypeLayerPredicate = (layer: TypeLayer) => boolean;

export type TypeMatrix = {
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number
};
