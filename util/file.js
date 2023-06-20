const fs = require("fs");
const ServerDown = require("../errors/ServerDown");

const deleteFile = (filePath) => {
  try {
    fs.unlink(filePath, (err) => {
      if (err) throw new ServerDown("can not delete file");
    });
  } catch (error) {
    throw new ServerDown("can not delete file");
  }
};

exports.deleteFile = deleteFile;
