// @flow
import type { Input } from "../types/types";

const resolvePath = (
  path: Array<string | number>,
  { config, value, depth }: { config: Input, value: any, depth: number }
): { config: Input, value: any, depth: number } => {
  const MAX_DEPTH = 10;
  // We subtract 1 because we don't include the root in the path when calling this function.
  if (path.length >= MAX_DEPTH - 1) {
    throw Error(
      "Your document has is nested more than 10 times! Reduce the amount of nesting."
    );
  }

  if (path.length > 0) {
    if (config.type === "Record") {
      const field = config.fields.find(field => field.key === path[0]);
      if (field !== undefined) {
        return resolvePath(path.slice(1), {
          config: field.input,
          value: value[path[0]],
          depth: depth + 1
        });
      }
    }

    if (config.type === "List")
      return resolvePath(path.slice(1), {
        config: config.inputs,
        value: value[path[0]],
        depth: depth + 1
      });

    throw Error("Can't resolve path.");
  }

  return { config, value, depth };
};

export default resolvePath;
