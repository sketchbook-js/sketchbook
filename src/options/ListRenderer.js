// // @flow

// import React from "react";

// import AbstractRenderer from "./absrenderer";

// import type { Node } from "react";

// import type { Input } from "../types/types";

// type Option = string | Array<Option> | { [key: string]: Option };

// const ListRenderer = ({
//   newPaths,
//   input,
//   values,
//   depth,
//   path,
//   onChange,
//   onNavigate
// }: {
//   newPaths: Array<string | number>,
//   input: Input,
//   values: Option,
//   depth: number,
//   path: Array<string | number>,
//   onChange: any,
//   onNavigate: any
// }): Node => {
//   if (!Array.isArray(values)) {
//     throw Error(
//       `At path: ${JSON.stringify(path)}, the list value is not an array.`
//     );
//   }

//   return path.length === depth ? (
//     values.map((value, index) => (
//       <AbstractRenderer
//         config={input}
//         value={value}
//         depth={depth + 1}
//         path={path}
//         onChange={({ currentTarget: { value } }) => onChange(index, value)}
//         onNavigate={onNavigate}
//         newPaths={[index]}
//       />
//     ))
//   ) : (
//     <button onClick={() => onNavigate(newPaths)} disabled={values.length === 0}>
//       {values.length} list item{values.length === 1 ? "" : "s"}
//     </button>
//   );
// };

// export default ListRenderer;
