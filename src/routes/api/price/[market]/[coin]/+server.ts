import { getPrice, redisClient } from '$redis/redis';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url }): Promise<Response> => {
	const { market, coin } = params;
	const type = url.searchParams.get('type');

	if (market && type && coin) {
		const price = await getPrice(market, type, coin);

		return json({ success: true, price });
	}

	return json({ success: false });
};

export const POST: RequestHandler = async ({ request }) => {
	return json({ message: 'Hello World' });
};
