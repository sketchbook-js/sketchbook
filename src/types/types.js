// @flow

/* eslint-disable no-use-before-define */

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

// DEPRECATED
export type Field = {
  key: string,
  label: string,
  input: Input
};

// DEPRECATED
export type Input =
  | ListInput
  | RecordInput
  | StringInput
  | PlainTextInput
  | CheckboxInput
  | CheckboxesInput;

// DEPRECATED
export type ListInput = {
  type: "List",
  inputs: Input
};

// DEPRECATED
export type RecordInput = {
  type: "Record",
  fields: Field[]
};

// DEPRECATED
export type StringInput = {
  type: "String"
};

// DEPRECATED
export type PlainTextInput = {
  type: "PlainText"
};

// DEPRECATED
export type CheckboxInput = {
  type: "Checkbox",
  description?: string
};

// DEPRECATED
export type CheckboxesInput = {
  type: "Checkboxes",
  items: CheckboxItem[]
};

// DEPRECATED
export type CheckboxItem = {
  label: string,
  value: any
};

export type Option =
  | ListOption
  | RecordOption
  | StringOption
  | PlainTextOption
  | CheckboxOption
  | CheckboxesOption;

export type ListOption = {
  type: "List",
  path: OptionPath,
  items: Array<Option>
};

export type RecordOption = {
  type: "Record",
  path: OptionPath,
  fields: Array<{
    value: Option,
    label: string
  }>
};

export type StringOption = {
  type: "String",
  path: OptionPath,
  value: string
};

export type PlainTextOption = {
  type: "PlainText",
  path: OptionPath,
  value: string
};

export type CheckboxOption = {
  type: "Checkbox",
  path: OptionPath,
  description: ?string,
  value: boolean
};

export type CheckboxesOption = {
  type: "Checkboxes",
  path: OptionPath,
  items: Array<{
    value: string,
    checked: boolean,
    label: string
  }>
};

export type OptionPath = Array<string | number>;
