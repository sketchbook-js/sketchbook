#!/usr/bin/env node

const process = require("process");
const path = require("path");
const fs = require("fs-extra");
const arg = require("arg");
const express = require("express");

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
    const designFile = args._[1]
      ? path.join(process.cwd(), args._[1])
      : path.join(process.cwd(), "sketchbook/example.json");

    if (fs.existsSync(configFile))
      throw Error(`Config file already exists: ${configFile}`);

    if (fs.existsSync(designFile))
      throw Error(`Design file already exists: ${designFile}`);

    console.log(`Creating config: ${configFile}`);

    fs.ensureDirSync(path.dirname(configFile));
    fs.copySync(path.join(__dirname, "../build/config.js"), configFile);

    console.log(`Creating example design: ${designFile}`);

    fs.ensureDirSync(path.dirname(designFile));
    fs.copySync(path.join(__dirname, "../build/example.json"), designFile);

    console.log("Done.");

    break;
  }
  case "start": {
    const designFile = args._[1]
      ? path.join(process.cwd(), args._[1])
      : undefined;

    if (!designFile)
      throw Error(
        `Design file not provided. You need to specify a design file like this:

  sketchbook start example.json
`,
      );

    if (!fs.existsSync(configFile))
      throw Error(`Could not find config file: ${configFile}`);

    if (!fs.existsSync(designFile))
      throw Error(`Could not find design file: ${designFile}`);

    console.log(`Using config: ${configFile}`);
    console.log(`Editing design: ${designFile}`);

    const app = express();

    app.use(express.json());

    app.get("/env.js", (req, res) => {
      res.type("text/javascript");
      res.send("window.SKETCHBOOK_MODE = 'dynamic';");
    });
    app.get("/config.js", (req, res) => res.sendFile(configFile));
    app.get("/design.json", (req, res) => {
      res.type("json").sendFile(designFile);
    });
    app.put("/design.json", (req, res) => {
      try {
        fs.writeFileSync(designFile, JSON.stringify(req.body, null, 2));
        res.json(true);
      } catch (err) {
        console.error(err);
        res.status(500).json(`Unable to save design file: ${designFile}`);
      }
    });
    app.use("/canvas", express.static(path.join(__dirname, "../build/canvas")));
    app.use("/editor", express.static(path.join(__dirname, "../build/editor")));
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
  case "build": {
    // TODO: Create a standalone static build of the app with SKETCHBOOK_MODE = 'static'
    //
    // All the meta files will need to be moved to the root dir:
    //
    // fs.renameSync(
    //   path.join(__dirname, "../build/editor/index.html"),
    //   path.join(__dirname, "../build/index.html")
    // );
    // fs.renameSync(
    //   path.join(__dirname, "../build/meta/favicon.ico"),
    //   path.join(__dirname, "../build/favicon.ico")
    // );
    // fs.renameSync(
    //   path.join(__dirname, "../build/meta/logo192.png"),
    //   path.join(__dirname, "../build/logo192.png")
    // );
    // fs.renameSync(
    //   path.join(__dirname, "../build/meta/logo512.png"),
    //   path.join(__dirname, "../build/logo512.png")
    // );
    // fs.renameSync(
    //   path.join(__dirname, "../build/meta/manifest.json"),
    //   path.join(__dirname, "../build/manifest.json")
    // );
    // fs.renameSync(
    //   path.join(__dirname, "../build/meta/robots.txt"),
    //   path.join(__dirname, "../build/robots.txt")
    // );
    break;
  }
  case "help":
  default: {
    console.log(`Usage: sketchbook [options] [command] [file]


  File:

    A relative path to the design file to edit (when running \`start\`) or
    generate (when running \`init\`). (default: sketchbook/example.json)

  Commands:

    init           Creates the default config file
    start          Starts the app
    help           Display this help information

  Options:
  
    -b, --bind     The host to bind the app to (default: localhost)
    -c, --config   A relative path to the config file (default: sketchbook/config.js)
    -h, --help     Display this help information
    -p, --port     The port to run the app on (default: 3000)
`);
    break;
  }
}
