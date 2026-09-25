import {
  configure,
  getAnsiColorFormatter,
  getConsoleSink,
  getJsonLinesFormatter,
} from "@logtape/logtape";
import { getFileSink } from "@logtape/file";

let started: Promise<void> | undefined;

export function configureLogging(): Promise<void> {
  started ??= configure({
    reset: true,
    sinks: {
      console: getConsoleSink({
        formatter: getAnsiColorFormatter(),
      }),
      file: getFileSink("logs/server.log", {
        lazy: true,
        bufferSize: 8192,
        flushInterval: 5000,
        nonBlocking: true,
        formatter: getJsonLinesFormatter(),
      }),
    },
    loggers: [
      { category: "server", lowestLevel: "debug", sinks: ["console", "file"] },
    ],
  });
  return started;
}
