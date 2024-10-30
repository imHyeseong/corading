import { createClient } from 'redis';
import 'dotenv/config';

const redisURL = process.env.REDIS_URL;
const redisPass = process.env.REDIS_PASS;
const redisPort = process.env.REDIS_PORT;
const client = createClient({
	password: redisPass,
	socket: {
		host: redisURL,
		port: Number(redisPort)
	}
});

await client.connect();

client.on('error', (error) => {
	console.error('Redis Error:', error);
});

export { client as redisClient };
