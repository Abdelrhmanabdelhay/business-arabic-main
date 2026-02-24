import winston from "winston";

import { config } from "../config/environment";

interface LogLevels extends winston.config.AbstractConfigSetLevels {
  error: number;
  warn: number;
  info: number;
  http: number;
  debug: number;
}

const levels: LogLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = (): string => {
  const env = config.nodeEnv || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

const colors: winston.config.AbstractConfigSetColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const transports: winston.transport[] = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: "logs/all.log" }),
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

interface LoggerStream {
  write: (message: string) => void;
}
// @ts-ignore
(Logger as winston.Logger & { stream: LoggerStream }).stream = {
  write: (message: string) => Logger.http(message.trim()),
};

export default Logger;
