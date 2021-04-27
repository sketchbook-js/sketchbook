#!/usr/bin/env node

const process = require("process");
const path = require("path");
const fs = require("fs-extra");
const arg = require("arg");
const express = require("express");
const glob = require("glob");

const args = arg({
  "--config": String,
  "--file": String,
  "--port": Number,
  "--bind": String,
  "--help": Boolean,
  "-c": "--config",
  "-f": "--file",
  "-p": "--port",
  "-b": "--bind",
  "-h": "--help",
});

const configFile = path.join(
  process.cwd(),
  args["--config"] === undefined || args["--config"] === null
    ? process.env.SKETCHBOOK_CONFIG === undefined ||
      process.env.SKETCHBOOK_CONFIG === null
      ? "sketchbook/config.js"
      : process.env.SKETCHBOOK_CONFIG
    : args["--config"],
);

const designsDir = path.join(
  process.cwd(),
  args["--designs"] === undefined || args["--designs"] === null
    ? process.env.SKETCHBOOK_DESIGNS === undefined ||
      process.env.SKETCHBOOK_DESIGNS === null
      ? "sketchbook/designs"
      : process.env.SKETCHBOOK_DESIGNS
    : args["--designs"],
);

const designFileName =
  args["--file"] === undefined || args["--file"] === null
    ? process.env.SKETCHBOOK_EXAMPLE_DESIGN === undefined ||
      process.env.SKETCHBOOK_EXAMPLE_DESIGN === null
      ? "example.json"
      : process.env.SKETCHBOOK_EXAMPLE_DESIGN
    : args["--file"];
const designFilePath = path.join(designsDir, designFileName);

const port =
  args["--port"] === undefined || args["--port"] === null
    ? 3000
    : args["--port"];

const host =
  args["--bind"] === undefined || args["--bind"] === null
    ? "localhost"
    : args["--bind"];

const command = args["--help"] ? "help" : args._[0];

switch (command) {
  case "init": {
    console.log(`Creating config: ${configFile}`);

    fs.ensureDirSync(path.dirname(configFile));
    fs.copySync(path.join(__dirname, "../build/config.js"), configFile);

    break;
  }
  case "start": {
    console.log(`Using config: ${configFile}`);

    if (!fs.existsSync(configFile))
      throw Error(`Could not find config file: ${configFile}`);

    if (!fs.existsSync(designFilePath))
      throw Error(`Design file: '${designFilePath}' does not exist.
      PMake sure the path to the file is correct.`);

    const app = express();

    app.set("json spaces", 2);
    app.use(express.json());
    app.use(express.urlencoded());

    app.get("/env.js", (req, res) => {
      res.type("text/javascript");
      res.send("window.SKETCHBOOK_MODE = 'interactive';");
    });
    app.get("/config.js", (req, res) => res.sendFile(configFile));
    app.get(
      "/designs.json",
      (req, res) => res.json([designFileName]),
      // TODO: Code to get multiple design files from the design directory.
      // res.json(
      //   glob.sync("**/*.json", {
      //     cwd: path.join(__dirname, "../build/designs"),
      //   }),
      // ),
    );
    app.get("/design", (req, res) => {
      res.sendFile(designFilePath);
    });
    app.post("/design", (req, res) => {
      try {
        fs.writeFileSync(designFilePath, JSON.stringify(req.body.doc, null, 2));
        return res.json({
          statusCode: 200,
          message: `Design file successfully saved to ${designFilePath}.`,
        });
      } catch (err) {
        console.error(err);
        return {
          statusCode: 500,
          message: `Design file unable to be saved to ${designFilePath}. Please try again.`,
        };
      }
    });
    app.use("/canvas", express.static(path.join(__dirname, "../build/canvas")));
    app.use("/editor", express.static(path.join(__dirname, "../build/editor")));
    app.use("/designs", express.static(designsDir));
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../build/editor/index.html"));
    });
    app.use("/", express.static(path.join(__dirname, "../build/meta")));

    app.listen(port, host, () => {
      console.log(`Sketchbook started:

  http://${host}:${port}
`);
    });

    break;
  }
  case "help":
  default: {
    console.log(`Usage: sketchbook [options] [command]


  Commands:

    init           Creates the default config file
    start          Starts the app
    help           Display this help information

  Options:
  
    -b, --bind     The host to bind the app to (default: localhost)
    -c, --config   A relative path to the config file (default: sketchbook/config.js)
    -d, --designs  A relative path to the designs directory (default: sketchbook/designs)
    -f, --file     A relative path to the design file
    -h, --help     Display this help information
    -p, --port     The port to run the app on (default: 3000)
`);
    break;
  }
}
