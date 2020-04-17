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
      [`\n${chalk.hex(color)(`${label}\n>`)} `]
    )
    .join("");

module.exports = labelOutput;
