import React from "react";
import ReactDOM from "react-dom";

import Editor from "./Editor";
import Reset from "./Reset";

window.Sketchbook = {
  init: config => {
    ReactDOM.render(
      <>
        <Reset />
        <Editor config={config} />
      </>,
      document.getElementById("root")
    );
  }
};
