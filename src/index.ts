import { createYoga } from 'graphql-yoga';
import schema from './schema';

const yoga = createYoga({
	schema,
});

const server = Bun.serve({
	fetch: yoga,
	port: 4000,
});

console.info(`
    Server is running on ${new URL(
		yoga.graphqlEndpoint,
		`http://${server.hostname}:${server.port}`
	)}
`);
