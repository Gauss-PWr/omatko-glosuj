import type { ServerInit, Handle } from '@sveltejs/kit';
import {
	configure,
	getAnsiColorFormatter,
	getConsoleSink,
	getJsonLinesFormatter
} from '@logtape/logtape';
import { getFileSink } from '@logtape/file';

export const init: ServerInit = async () => {
	await configure({
		sinks: {
			console: getConsoleSink({
				formatter: getAnsiColorFormatter()
			}),
			file: getFileSink('logs/server.log', {
				lazy: true,
				bufferSize: 8192,
				flushInterval: 5000,
				nonBlocking: true,
				formatter: getJsonLinesFormatter()
			})
		},
		loggers: [{ category: 'server', lowestLevel: 'debug', sinks: ['console', 'file'] }]
	});
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	return response;
};
