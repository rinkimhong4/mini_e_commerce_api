// const fs= require("fs/promises");
// const moment = require("moment");
// const logError = async (controller, message, res) => {
//     try {
//         // Append the log message to the file (create the file if it doesn't exist)
//         const timestamp = moment().format("DD-MM-YYYY HH:mm:ss"); // Use 'moment' for timestamp
//         const date_= moment().format("DD-MM-YYYY"); // Use 'moment' for timestamp
//         const path = "./logs/" + controller + date_ + ".txt";
//         const logMessage = "[" + timestamp + "] " + message + "\n";
//         await fs.appendFile(path, logMessage);
//     } catch (error) {
//         console.error("Error writing to log file:", error);
//     }
    
//     // Only send response if res parameter is provided
//     if (res) {
//         res.status(500).send("Internal Server Error!");
//     }
// };

// const IsNullOrempty= (value) => {
//     if(value===null || value==="")
//     {
//         return true;
//     }
//     else
//     {
//         return false;
//     }
// }

// module.exports = {logError, IsNullOrempty};



const fs = require("fs/promises");
const path = require("path");
const moment = require("moment");

const logError = async (controller, message, res) => {
  try {
    // Ensure logs folder exists
    const logDir = path.join(__dirname, "../logs/logs");
    await fs.mkdir(logDir, { recursive: true });

    // Generate timestamp and daily log filename
    const timestamp = moment().format("DD-MM-YYYY HH:mm:ss");
    const date = moment().format("DD-MM-YYYY");
    const logPath = path.join(logDir, `${controller}-${date}.txt`);

    const logMessage = `[${timestamp}] ${message}\n`;

    // Append log message
    await fs.appendFile(logPath, logMessage);

  } catch (error) {
    console.error("Error writing to log file:", error);
  }

  // Only send response if 'res' is provided
  if (res) {
    res.status(500).send("Internal Server Error!");
  }
};

// Utility function to check null or empty
const IsNullOrEmpty = (value) => value === null || value === "";

module.exports = { logError, IsNullOrEmpty };
