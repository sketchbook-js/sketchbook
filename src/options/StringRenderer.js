import React from "react";

const StringRenderer = ({
  value,
  onChange
}: {
  value: string,
  onChange: any
}) => {
  return (
    <input
      type="text"
      value={String(value)}
      onChange={({ currentTarget: { value } }) => onChange(null, value)}
    />
  );
};

export default StringRenderer;

// <Fragment key={key}>
//                             {error ? (
//                               <OptionsErrorMessage
//                                 style={{
//                                   paddingTop: index === 0 ? "4px" : "0px",
//                                   paddingLeft: "6px",
//                                 }}
//                               >
//                                 {error.message}
//                               </OptionsErrorMessage>
//                             ) : null}
//                             <div
//                               id={`option-${key}`}
//                               type="text"
//                               style={{
//                                 display: "grid",
//                                 gridTemplateColumns:
//                                   "repeat(1, min-content 1fr)",
//                                 alignItems: "center",
//                                 justifyItems: "center",
//                                 gap: 6,
//                                 padding: 6,
//                               }}
//                             >
//                               <Label htmlFor={`option-${key}`}>{label}</Label>
//                               <Input
//                                 key={key}
//                                 id={`option-${key}`}
//                                 type="text"
//                                 value={
//                                   doc.layers.find(
//                                     ({ id }) => id === [...selection][0]
//                                   ).options[key]
//                                 }
//                                 onChange={({ currentTarget: { value } }) => {
//                                   setState((current) => ({
//                                     ...current,
//                                     doc: {
//                                       layers: current.doc.layers.map((layer) =>
//                                         layer.id === [...selection][0]
//                                           ? {
//                                               ...layer,
//                                               options: {
//                                                 ...layer.options,
//                                                 [key]: value,
//                                               },
//                                             }
//                                           : layer
//                                       ),
//                                     },
//                                   }));
//                                 }}
//                               />
//                             </div>
//                           </Fragment>
