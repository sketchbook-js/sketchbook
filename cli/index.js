#!/usr/bin/env node

const process = require("process");
const path = require("path");
const fs = require("fs-extra");
const arg = require("arg");
const express = require("express");

const args = arg({
  "--config": String,
  "--port": Number,
  "--bind": String,
  "--help": Boolean,
  "-c": "--config",
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

    const app = express();

    app.get("/config.js", (req, res) => res.sendFile(configFile));
    app.use("/canvas", express.static(path.join(__dirname, "../build/canvas")));
    app.use("/editor", express.static(path.join(__dirname, "../build/editor")));
    app.get("/", (req, res) =>
      res.sendFile(path.join(__dirname, "../build/editor/index.html")),
    );
    app.use("/", express.static(path.join(__dirname, "../build/meta")));

    app.listen(port, host, () =>
      console.log(`Sketchbook started:

  http://${host}:${port}
`),
    );

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

    -c, --config   A relative path to the config file (default: sketchbook/config.js)
    -p, --port     The port to run the app on (default: 3000)
    -b, --bind     The host to bind the app to (default: localhost)
    -h, --help     Display this help information
`);
    break;
  }
}
