// import { redisClient } from '$redis/redis';
// import { getAllMarkets } from '$stores/market.svelte';
// import { json, type RequestHandler } from '@sveltejs/kit';

// type PriceResponse = Record<string, string>;

// export const GET: RequestHandler = async (): Promise<Response> => {
// 	const kor_price: PriceResponse = await redisClient.hGetAll(`price:${kor.market}`);
// 	const intl_price: PriceResponse = await redisClient.hGetAll(`price:${intl.market}`);
// };

// export const POST: RequestHandler = async ({ request }) => {
// 	return json({ message: 'Hello World' });
// };

// const getPrice = async (market: string) => {
// 	const price = await redisClient.hGetAll(`price:${market}`);
// 	return { [market]: price };
// };
