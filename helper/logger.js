const fs = require("fs");
const path = require("path");

const helper = {};

const logFilePath = path.join(__dirname, "../app.log");
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "");
}

helper.log = (message, errorPath) => {
  const logEntry = `${new Date().toISOString()} ["error"] ${
    typeof message === "object" ? JSON.stringify(message) : message
  }${
    errorPath
      ? ` (Error Path: ${
          typeof errorPath === "object" ? JSON.stringify(errorPath) : errorPath
        })`
      : ""
  }\n`;

  try {
    const existingLogs = fs.readFileSync(logFilePath, "utf8");
    fs.writeFileSync(logFilePath, logEntry + existingLogs);
  } catch (err) {
    console.error("Error writing to log file:", err);
  }
};

module.exports = helper;
