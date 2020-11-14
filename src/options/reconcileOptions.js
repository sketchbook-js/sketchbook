// @flow

import type { Option, OptionPath } from "../types/types";

const configError = (message: string, path: OptionPath) =>
  Error(`${message} (path=${path.length ? path.join(".") : "<root>"})`);

const valueError = (message: string, path: OptionPath) =>
  Error(`${message} (path=${path.length ? path.join(".") : "<root>"})`);

/**
 * Used to combine the config and doc into one object
 * that can be more easier recursed over in resolvePath
 */
const reconcileOptions = (
  input: mixed,
  value: mixed,
  path: OptionPath = []
): Option => {
  if (input === null || typeof input !== "object")
    throw configError("Missing or invalid input.", path);

  switch (input.type) {
    case "Record": {
      if (!Array.isArray(input.fields))
        throw configError(
          'A "Record" option must have a `fields` property that is an array.',
          path
        );
      if (value === null || typeof value !== "object")
        throw valueError(
          'The value of a "Record" option must be an object.',
          path
        );

      return {
        type: "Record",
        path,
        fields: input.fields.map(field => {
          if (field === null || typeof field !== "object")
            throw configError(
              'Every field of a "Record" option must be an object.',
              path
            );

          const { key, input: fieldInput, label } = field;

          if (typeof key !== "string")
            throw configError(
              'Every field of a "Record" option must have a `key` property that is a string.',
              path
            );
          if (typeof label !== "string")
            throw configError(
              'Every field of a "Record" option must have a `label` property that is a string.',
              path
            );

          return {
            value: reconcileOptions(fieldInput, value[key], path.concat(key)),
            label: label
          };
        })
      };
    }

    case "List": {
      if (!Array.isArray(value))
        throw valueError(
          'The value of a "List" option must be an array.',
          path
        );
      return {
        type: "List",
        path,
        items: value.map((item, index) =>
          reconcileOptions(input.inputs, item, path.concat(index))
        )
      };
    }

    case "String": {
      if (typeof value !== "string")
        throw valueError(
          'The value of a "String" option must be a string.',
          path
        );
      return {
        type: "String",
        path,
        value
      };
    }

    case "PlainText": {
      if (typeof value !== "string")
        throw valueError(
          'The value of a "PlainText" option must be a string.',
          path
        );
      return {
        type: "PlainText",
        path,
        value
      };
    }

    case "Checkbox": {
      if (input.description !== null && typeof input.description !== "string")
        throw configError(
          'A "Checkbox" option must have a `description` property that is either null or a string.',
          path
        );
      if (typeof value !== "boolean")
        throw valueError(
          'The value of a "Checkbox" option must be a string.',
          path
        );
      return {
        type: "Checkbox",
        path,
        description: input.description,
        value
      };
    }

    case "Checkboxes": {
      if (!Array.isArray(input.items))
        throw configError(
          'A "Checkboxes" option must have a `items` property that is an array.',
          path
        );
      if (!Array.isArray(value))
        throw valueError(
          'The value of a "Checkboxes" option must be an array.',
          path
        );
      return {
        type: "Checkboxes",
        path,
        items: input.items.map(item => {
          if (item === null || typeof item !== "object")
            throw configError(
              'Every item of a "Checkboxes" option must be an object.',
              path
            );

          const { label, value: itemValue } = item;

          if (typeof label !== "string")
            throw configError(
              'Every item of a "Checkboxes" option must have a `label` property that is a string.',
              path
            );
          if (typeof itemValue !== "string")
            throw configError(
              'Every item of a "Checkboxes" option must have a `value` property that is a string.',
              path
            );

          return {
            label,
            value: itemValue,
            checked: value.includes(itemValue)
          };
        })
      };
    }

    default:
      throw configError(`Unknown option type: \`${String(input.type)}\``, path);
  }
};

export default reconcileOptions;
