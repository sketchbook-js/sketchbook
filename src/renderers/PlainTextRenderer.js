import React from "react";

const PlainTextRenderer = ({
  value,
  onChange
}: {
  value: string,
  onChange: any
}) => {
  return (
    <textarea
      type="text"
      value={String(value)}
      onChange={({ currentTarget: { value } }) => onChange(null, value)}
    />
  );
};

// <Fragment key={key}>
//   {error ? (
//     <OptionsErrorMessage
//       style={{
//         paddingTop: index === 0 ? "4px" : "0px",
//         paddingLeft: "6px",
//       }}
//     >
//       {error.message}
//     </OptionsErrorMessage>
//   ) : null}
//   <div
//     style={{
//       display: "grid",
//       gridTemplateColumns: "repeat(1, min-content 1fr)",
//       alignItems: "center",
//       justifyItems: "center",
//       gap: 6,
//       padding: 6,
//     }}
//   >
//     <Label htmlFor={`option-${key}`}>{label}</Label>
//     <Textarea
//       key={key}
//       id={`option-${key}`}
//       type="text"
//       style={{
//         minHeight: "8em",
//       }}
//       value={doc.layers.find(({ id }) => id === [...selection][0]).options[key]}
// onChange={({ currentTarget: { value } }) => {
//   setState((current) => ({
//     ...current,
//     doc: {
//       layers: current.doc.layers.map((layer) =>
//         layer.id === [...selection][0]
//           ? {
//               ...layer,
//               options: {
//                 ...layer.options,
//                 [key]: value,
//               },
//             }
//           : layer
//       ),
//     },
//   }));
// }}
//     />
//   </div>
// </Fragment>;

export default PlainTextRenderer;
