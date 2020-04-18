const fs = require("fs-extra");
const path = require("path");

const copyPublicFolder = () => {
  fs.emptyDirSync(path.resolve(__dirname, "../build"));

  fs.copySync(
    path.resolve(__dirname, "../public"),
    path.resolve(__dirname, "../build"),
    {
      dereference: true,
      filter: file => path.basename(file) !== ".DS_Store"
    }
  );
};

module.exports = copyPublicFolder;
