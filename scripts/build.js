const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const glob = require("glob");

const copyPublicFolder = require("./copyPublicFolder");

const canvas = require("../config/webpack.canvas");
const editor = require("../config/webpack.editor");

process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

copyPublicFolder();

webpack(
  [
    { ...canvas, mode: "production" },
    { ...editor, mode: "production" }
  ],
  (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(err || stats.toJson("minimal"));
    }
    fs.writeFileSync(
      path.join(__dirname, "../build/designs.json"),
      JSON.stringify(
        glob.sync("**/*.json", {
          cwd: path.join(__dirname, "../build/designs")
        }),
        null,
        2
      )
    );
    fs.renameSync(
      path.join(__dirname, "../build/editor/index.html"),
      path.join(__dirname, "../build/index.html")
    );
    fs.renameSync(
      path.join(__dirname, "../build/meta/favicon.ico"),
      path.join(__dirname, "../build/favicon.ico")
    );
    fs.renameSync(
      path.join(__dirname, "../build/meta/logo192.png"),
      path.join(__dirname, "../build/logo192.png")
    );
    fs.renameSync(
      path.join(__dirname, "../build/meta/logo512.png"),
      path.join(__dirname, "../build/logo512.png")
    );
    fs.renameSync(
      path.join(__dirname, "../build/meta/manifest.json"),
      path.join(__dirname, "../build/manifest.json")
    );
    fs.renameSync(
      path.join(__dirname, "../build/meta/robots.txt"),
      path.join(__dirname, "../build/robots.txt")
    );
    console.log("Done.");
  }
);
