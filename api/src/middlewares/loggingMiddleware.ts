import morgan from "morgan";

import { config } from "../config/environment";
import Logger from "../utils/logger";

interface StreamObject {
  write: (message: string) => void;
}

const stream: StreamObject = {
  write: (message: string) => Logger.http(message),
};

const skip = (): boolean => {
  const env = config.nodeEnv || "development";
  return env !== "development";
};

const morganMiddleware = morgan(":remote-addr :method :url :status :res[content-length] - :response-time ms", {
  stream,
  skip,
});

export default morganMiddleware;
