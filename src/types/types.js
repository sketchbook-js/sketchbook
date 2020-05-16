/* eslint-disable no-use-before-define */
// @flow

type TODO = any;

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

type Field = {
  key: string,
  label: string,
  input: Input
};

type Input =
  | ListInput
  | RecordInput
  | StringInput
  | PlainTextInput
  | CheckboxInput
  | CheckboxesInput;

type ListInput = {
  type: "List",
  inputs: Input
};

type RecordInput = {
  type: "Record",
  fields: Field[]
};

type StringInput = {
  type: "String",
  description?: string
};

type PlainTextInput = {
  type: "PlainText",
  description?: string
};

type CheckboxInput = {
  type: "Checkbox",
  description?: string
};

type CheckboxesInput = {
  type: "Checkboxes",
  items: CheckboxItem[]
};

type CheckboxItem = {
  label: string,
  value: any
};
