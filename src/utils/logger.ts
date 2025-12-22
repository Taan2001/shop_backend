// libs
import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const customFormat = format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const baseLogger = createLogger({
    level: "info",
    format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }), customFormat),
    transports: [
        new transports.Console({
            format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }), customFormat, format.colorize({ all: true })),
        }),
        new transports.File({ filename: path.join(logDir, "combined.log") }),
        new transports.File({ filename: path.join(logDir, "errors.log"), level: "error" }),
    ],
});

// ✅ wrapper methods
const logger = {
    info: baseLogger.info.bind(baseLogger),
    error: baseLogger.error.bind(baseLogger),

    request: <T>(requestId: string, apiName: string, payload: T) => {
        baseLogger.info(`START Request ID:${requestId} - [API ${apiName}] - Request: ${JSON.stringify(payload)}`);
    },

    response: <T>(requestId: string, apiName: string, response: T) => {
        baseLogger.info(`END Request ID:${requestId} - [API ${apiName}] - Response: ${JSON.stringify(response)}`);
    },

    newError: <T>(requestId: string, apiName: string, error: T) => {
        baseLogger.error(`END Request ID:${requestId} - [API ${apiName}] - Error: ${JSON.stringify(error)}`);
    },
};

export default logger;
