// @flow

import React, { Fragment } from "react";

import type { Field, Input } from "../types/types";

import resolvePath from "./resolvePath";

import StringRenderer from "./StringRenderer";
import PlainTextRenderer from "./PlainTextRenderer";

const ListRenderer = <T>({
  newPaths,
  input,
  values,
  depth,
  path,
  onChange,
  onNavigate
}: {
  newPaths: Array<string | number>,
  input: Input,
  values: any,
  depth: number,
  path: Array<string | number>,
  onChange: any,
  onNavigate: any
}) => {
  return path.length === depth ? (
    values.map((value, index) => (
      <AbstractRenderer
        config={input}
        value={value}
        depth={depth + 1}
        path={path} // FIXME: Does this need to be here?
        onChange={({ currentTarget: { value } }) => onChange(index, value)}
        onNavigate={onNavigate}
        newPaths={[index]}
      />
    ))
  ) : (
    <button onClick={() => onNavigate(newPaths)} disabled={values.length === 0}>
      {values.length} list item{values.length === 1 ? "" : "s"}
    </button>
  );
};

const AbstractRenderer = <T>({
  newPaths,
  config,
  value,
  path,
  depth,
  onNavigate,
  onChange
}: {
  newPaths: Array<string | number>,
  config: Input, // the configuration for this option from config.js
  value: any, // the value of this option from the document
  path: Array<string | number>,
  depth: number,
  onNavigate: any,
  onChange: any
}) => {
  switch (config.type) {
    case "List":
      return (
        <ListRenderer
          newPaths={newPaths}
          input={config.inputs}
          values={value}
          depth={depth + 1}
          path={path}
          onNavigate={onNavigate}
          onChange={onChange}
        />
      );
    case "Record":
      return (
        <RecordRenderer
          depth={depth + 1}
          onChange={onChange}
          fields={config.fields}
          values={value}
          path={path}
          newPaths={newPaths}
          onNavigate={onNavigate}
        />
      );
    case "PlainText":
      return <PlainTextRenderer value={value} onChange={onChange} />;
    case "String":
      return <StringRenderer value={value} onChange={onChange} />;
    default:
      return null;
  }
};

const RecordRenderer = <T>({
  newPaths,
  fields,
  values,
  path,
  depth,
  onNavigate,
  onChange
}: {
  newPaths: Array<string | number>,
  fields: Field[],
  values: { [key: string]: any },
  path: Array<string | number>,
  depth: number,
  onNavigate: any,
  onChange: any
}) => {
  if (depth === 0 && path.length > 0) {
    const field = fields.find(field => field.key === path[0]);
    const config = field.input;
    const value = values[field.key];
    return (
      <AbstractRenderer
        {...resolvePath(path.slice(1), { config, value, depth })}
        path={path}
        onNavigate={onNavigate}
        onChange={onChange}
        newPaths={[]}
      />
    );
  }

  return fields.length === 0 ? null : path.length === depth ? (
    fields.map<any>((field, i) => (
      <div key={field.key}>
        <label>{field.label}</label>
        <AbstractRenderer
          newPaths={[field.key]}
          path={path}
          config={field.input || field.inputs}
          depth={depth}
          value={values[field.key]}
          onNavigate={onNavigate}
          onChange={onChange}
        />
      </div>
    ))
  ) : (
    <button onClick={() => onNavigate(newPaths)} disabled={fields.length === 0}>
      {fields.length} record item{fields.length === 1 ? "" : "s"}
    </button>
  );
};

export default RecordRenderer;