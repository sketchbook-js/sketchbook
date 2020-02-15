const path = require("path");
const { spawn } = require("child_process");
const chalk = require("chalk");

const labelOutput = (label, color, output) =>
  output
    .toString()
    .split("")
    .reduce(
      (result, char) => [
        ...result,
        char === "\n" ? `\n${chalk.hex(color)(">")} ` : char
      ],
      [`\n${chalk.hex(color)(`${label}:\n>`)} `]
    )
    .join("");

const processes = [
  {
    name: "Canvas Build",
    color: "#0099ff",
    process: spawn("webpack", [
      "--env.development",
      "--watch",
      "--config",
      path.resolve(__dirname, "../config/webpack.canvas.js")
    ])
  },
  {
    name: "Editor Build",
    color: "#00ff99",
    process: spawn("webpack", [
      "--env.development",
      "--watch",
      "--config",
      path.resolve(__dirname, "../config/webpack.editor.js")
    ])
  },
  {
    name: "Server",
    color: "#00ffff",
    process: spawn("servor", [
      path.resolve(__dirname, "../build"),
      "index.html",
      8080,
      "--reload",
      "--browse"
    ])
  }
];

processes.forEach(({ name, color, process }) => {
  console.log(`${chalk.hex(color)(name)}: ${process.pid}`);
  process.stdout.on("data", data => {
    console.log(labelOutput(name, color, data));
  });
  process.stderr.on("data", data => {
    console.error(labelOutput(name, color, data));
  });
  process.on("close", code => {
    console.log(labelOutput(name, color, `exited with code ${code}`));
  });
});
