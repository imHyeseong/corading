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

type GetPriceOption = {
	raw: boolean;
};

const getPrice = async (
	market: string,
	type: string,
	coin: string,
	option: GetPriceOption = { raw: false }
): Promise<number | Price | null> => {
	const key = `price:${coin}`;
	const field = `market:${market}:type:${type}`;
	const price = await client.hGet(key, field);

	if (!price) return null;
	const parsed = JSON.parse(price);
	return option.raw ? (parsed as Price) : (parsed.price as number);
};

const getAllPrice = async (coin: string) => {
	const key = `price:${coin}`;
	const prices = await client.hGetAll(key);

	return Object.keys(prices).map((key) => {
		const [_, market] = key.split(':');
		const value: Price = JSON.parse(prices[key]);
		return { market, price: value.price };
	});
};

const publisher = createClient({
	socket: {
		host: redisURL,
		port: Number(redisPort)
	}
});

const subscriber = createClient({
	socket: {
		host: redisURL,
		port: Number(redisPort)
	}
});

await publisher.connect();
await subscriber.connect();

const pipeline = client.multi();

const HSET = (key: string, field: string, value: any) => {
	pipeline.hSet(key, field, value);
};

setInterval(() => {
	pipeline.exec();
}, 1000);

export { client as redisClient, getPrice, subscriber, publisher, getAllPrice, pipeline, HSET };
