// @flow

export type TODO = any;

export type Layer = {
  id: number,
  type: string,
  component: string,
  name: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options?: TODO
};

export type Predicate<T> = (item: T) => boolean;

export type Matrix = {
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number
};

export type SketchbookDocument = {
  type: "SketchbookDocument",
  layers: Array<Layer>
};

export type Field = {
  key: string,
  label: string,
  input: Input
};

export type Input =
  | ListInput
  | RecordInput
  | StringInput
  | PlainTextInput
  | CheckboxInput
  | CheckboxesInput;

export type ListInput = {
  type: "List",
  inputs: Input
};

export type RecordInput = {
  type: "Record",
  fields: Field[]
};

export type StringInput = {
  type: "String"
};

export type PlainTextInput = {
  type: "PlainText"
};

export type CheckboxInput = {
  type: "Checkbox",
  description?: string
};

export type CheckboxesInput = {
  type: "Checkboxes",
  items: CheckboxItem[]
};

export type CheckboxItem = {
  label: string,
  value: any
};
