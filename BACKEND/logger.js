// logger.js
const winston = require('winston');

// Define custom colors
const colors = {
    info: '32', // Green
    warn: '33',
    error: '31',
    debug: '36',
    verbose: '34',
    silly: '35',
    timestamp: '37', // white
    message: '37'
};

// Define the custom format
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    const formattedTimestamp = new Date(timestamp).toLocaleString();
    const uppercaseLevel = level.toUpperCase(); // Convert log level to uppercase

    // Apply colors
    const timestampColor = colors.timestamp;
    const levelColor = colors[level] || '37'; // Default color for level if not defined
    const messageColor = colors.message;

    return `\x1b[${timestampColor}m[${formattedTimestamp}]\x1b[0m \x1b[${levelColor}m${uppercaseLevel}:\x1b[0m \x1b[${messageColor}m${message}\x1b[0m`;
});

const logger = winston.createLogger({
    level: 'silly', // Set the default log level
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp first
        customFormat // Use the custom format defined above
    ),
    transports: [
        new winston.transports.Console(), // Log to the console
        new winston.transports.File({ filename: 'app.log' }) // Log to a file
    ],
});

// Optionally, you can set custom colors for console output
winston.addColors(colors);

module.exports = logger;
