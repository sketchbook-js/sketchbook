const path = require("path");
const webpack = require("webpack");
const fs = require("fs");

const copyPublicFolder = require("./copyPublicFolder");

const canvas = require("../config/webpack.canvas");
const editor = require("../config/webpack.editor");

process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

copyPublicFolder();

fs.copyFileSync(
  path.join(__dirname, "../example.json"),
  path.join(__dirname, "../build/example.json")
);

webpack(
  [
    { ...canvas, mode: "production" },
    { ...editor, mode: "production" }
  ],
  (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(err || stats.toJson("minimal"));
    } else {
      console.log("Done.");
    }
  }
);
