// @flow

import React from "react";

import AbstractRenderer from "./AbstractRenderer";
import resolvePath from "./resolvePath";

import type { Field } from "../types/types";

type Option = string | Array<Option> | { [key: string]: Option };

const RecordRenderer = ({
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
  values: { [key: string]: Option },
  path: Array<string | number>,
  depth: number,
  onNavigate: any,
  onChange: any
}) => {
  if (depth === 0 && path.length > 0) {
    const field = fields.find(field => field.key === path[0]);
    if (field !== undefined) {
      return (
        <AbstractRenderer
          {...resolvePath(path.slice(1), {
            config: field.input,
            value: values[field.key],
            depth
          })}
          path={path}
          onNavigate={onNavigate}
          onChange={onChange}
          newPaths={[]}
        />
      );
    }
  }

  if (!Array.isArray(fields)) {
    throw Error(
      `At path: ${JSON.stringify(path)}, the record field is not an array.`
    );
  }

  return fields.length === 0 ? null : path.length === depth ? (
    fields.map<any>((field, i) => {
      if (!field.key) {
        throw Error(`Record at path ${JSON.stringify(path)} is missing a key.`);
      }

      if (!field.label) {
        throw Error(
          `Record at path ${JSON.stringify(path)} is missing a label.`
        );
      }

      if (!field.input) {
        throw Error(`Record at path ${JSON.stringify(path)} is missing a key.`);
      }

      return (
        <div key={field.key}>
          <label>{field.label}</label>
          <AbstractRenderer
            newPaths={[field.key]}
            path={path}
            config={field.input}
            depth={depth}
            value={values[field.key]}
            onNavigate={onNavigate}
            onChange={onChange}
          />
        </div>
      );
    })
  ) : (
    <button onClick={() => onNavigate(newPaths)} disabled={fields.length === 0}>
      {fields.length} record item{fields.length === 1 ? "" : "s"}
    </button>
  );
};

export default RecordRenderer;
