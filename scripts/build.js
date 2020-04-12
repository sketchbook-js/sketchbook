const path = require("path");
const webpack = require("webpack");
const fs = require("fs-extra");

const canvas = require("../config/webpack.canvas");
const editor = require("../config/webpack.editor");

process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

fs.emptyDirSync(path.resolve(__dirname, "../build"));

fs.copySync(
  path.resolve(__dirname, "../public"),
  path.resolve(__dirname, "../build"),
  {
    dereference: true,
    filter: file =>
      ![
        path.resolve(__dirname, "../public/index.html"),
        path.resolve(__dirname, "../public/canvas/index.html")
      ].includes(file) && path.basename(file) !== ".DS_Store"
  }
);

webpack(
  [
    { ...canvas, mode: "production" },
    { ...editor, mode: "production" }
  ],
  (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(err || stats.toJson("minimal"));
    }
    console.log("Done.");
  }
);
