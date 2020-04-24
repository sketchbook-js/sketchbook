const process = require("process");
const path = require("path");
const { spawn } = require("child_process");

const copyPublicFolder = require("./copyPublicFolder");
const labelOutput = require("./labelOutput");

copyPublicFolder();

const subprocesses = [
  {
    name: "Canvas Build",
    color: "#0099ff",
    subprocess: spawn("webpack", [
      "--watch",
      "--config",
      path.resolve(__dirname, "../config/webpack.canvas.js")
    ])
  },
  {
    name: "Editor Build",
    color: "#00ffff",
    subprocess: spawn("webpack", [
      "--watch",
      "--config",
      path.resolve(__dirname, "../config/webpack.editor.js")
    ])
  },
  {
    name: "Server",
    color: "#009900",
    subprocess: spawn(
      "node",
      [path.resolve(__dirname, "../cli/index.js"), "start"],
      {
        env: {
          SKETCHBOOK_CONFIG: "public/config.js",
          ...process.env
        }
      }
    )
  }
].map(({ name, color, subprocess }) => {
  const stdout = data => {
    console.log(labelOutput(name, color, data));
  };
  const stderr = data => {
    console.error(labelOutput(name, color, data));
  };

  subprocess.stdout.on("data", stdout);
  subprocess.stderr.on("data", stderr);

  console.log(labelOutput(name, color, `Process started: ${subprocess.pid}`));

  return { name, color, subprocess, stdout, stderr };
});
