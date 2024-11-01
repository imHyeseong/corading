import { createClient } from 'redis';
import 'dotenv/config';

const redisURL = process.env.REDIS_URL;
const redisPort = process.env.REDIS_PORT;
const client = createClient({
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
