// // @flow

// import React from "react";

// import type { Input } from "../types/types";

// import RecordRenderer from "./RecordRenderer";
// import ListRenderer from "./ListRenderer";
// import StringRenderer from "./StringRenderer";
// import PlainTextRenderer from "./PlainTextRenderer";

// type Option = string | Array<Option> | { [key: string]: Option };

// const AbstractRenderer = ({
//   newPaths,
//   config,
//   value,
//   path,
//   depth,
//   onNavigate,
//   onChange
// }: {
//   newPaths: Array<string | number>,
//   config: Input, // the configuration for this option from config.js
//   value: Option, // the value of this option from the document
//   path: Array<string | number>,
//   depth: number,
//   onNavigate: any,
//   onChange: any
// }) => {
//   switch (config.type) {
//     case "List":
//       if (Array.isArray(value)) {
//         return (
//           <ListRenderer
//             newPaths={newPaths}
//             input={config.inputs}
//             values={value}
//             depth={depth + 1}
//             path={path}
//             onNavigate={onNavigate}
//             onChange={onChange}
//           />
//         );
//       }
//       break;
//     case "Record":
//       if (typeof value !== "string" && !Array.isArray(value)) {
//         return (
//           <RecordRenderer
//             depth={depth + 1}
//             onChange={onChange}
//             fields={config.fields}
//             values={value}
//             path={path}
//             newPaths={newPaths}
//             onNavigate={onNavigate}
//           />
//         );
//       }
//       break;
//     case "PlainText":
//       return <PlainTextRenderer value={value} onChange={onChange} />;
//     case "String":
//       return <StringRenderer value={value} onChange={onChange} />;
//     default:
//       throw Error("Config type is unknown. Use a known config type.");
//   }
//   return null;
// };

// export default AbstractRenderer;
