// @flow
import type { Option } from "../types/types";

const resolvePath = ({
  path,
  options,
  depth
}: {
  path: Array<string | number>,
  options: Option,
  depth: number
}): { options: Option, depth: number } => {
  const MAX_DEPTH = 10;
  // We subtract 1 because we don't include the root in the path when calling this function.
  if (options.path.length >= MAX_DEPTH - 1) {
    throw Error(
      `You cannot traverse more than ${MAX_DEPTH} layers deep! Please reduce the amount of nesting in your document.`
    );
  }

  if (path.length > 0) {
    if (options.type === "Record") {
      const nextField = options.fields.find(field => {
        const nextPath = field.value.path;
        const nextPathItem = nextPath[nextPath.length - 1];

        return nextPathItem === path[0];
      });

      if (nextField === undefined) {
        throw Error(
          `Cannot find a record that matches path: ${path.join(".")}`
        );
      }

      const nextOption = nextField.value;

      return resolvePath({
        path: path.slice(1),
        options: nextOption,
        depth: depth + 1
      });
    }

    if (options.type === "List") {
      // options.value.items when going from list to list
      // otherwise, option.items
      const listItems = options.items || options.value.items;
      const nextOption = listItems.find(item => {
        const nextPath = item.path;
        const nextPathItem = nextPath[nextPath.length - 1];

        return nextPathItem === path[1];
      });

      if (nextOption === undefined) {
        throw Error(
          `Cannot find a list item that matches path: ${path.join(".")}`
        );
      }

      return resolvePath({
        path: path.slice(2),
        options: nextOption,
        depth: depth + 1
      });
    }

    throw Error("Can't resolve path.");
  }

  return { options, depth };
};

export default resolvePath;
