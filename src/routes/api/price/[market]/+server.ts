import { redisClient } from '$redis/redis';
import { getAllMarkets } from '$stores/market.svelte';
import { json, type RequestHandler } from '@sveltejs/kit';

type PriceResponse = Record<string, string>;

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
	const { market } = params;

	if (!market) {
		return json({ success: false, error: 'Market is required' }, { status: 400 });
	}

	const price: PriceResponse = await redisClient.hGetAll(`price:${market}`);

	return json({ success: true, price });
};

export const POST: RequestHandler = async ({ request }) => {
	return json({ message: 'Hello World' });
};

const getPrice = async (market: string) => {
	const price = await redisClient.hGetAll(`price:${market}`);
	return { [market]: price };
};
