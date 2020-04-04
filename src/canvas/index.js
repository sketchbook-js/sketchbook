import React from "react";
import ReactDOM from "react-dom";

import Canvas from "../Canvas";
import Reset from "../Reset";

window.initSketchbook = config => {
  ReactDOM.render(
    <>
      <Reset />
      <Canvas config={config} />
    </>,
    document.getElementById("root")
  );
};
