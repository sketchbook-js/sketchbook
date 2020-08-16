// @flow
import type { Input } from "../../types/types";

const resolvePath = (
  path: Array<string | number>,
  { config, value, depth }: { config: Input, value: any, depth: number }
): { config: Input, value: any, depth: number } => {
  if (path.length > 0) {
    if (config.type === "Record")
      return resolvePath(path.slice(1), {
        config: config.fields.find(field => field.key === path[0]).input,
        value: value[path[0]],
        depth: depth + 1
      });

    if (config.type === "List")
      return resolvePath(path.slice(1), {
        config: config.inputs,
        value: value[path[0]],
        depth: depth + 1
      });

    throw new Error("Can't resolve path");
  }

  return { config, value, depth };
};

export default resolvePath;
