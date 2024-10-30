import { supabase } from '$db/db.ts';
import type { PageServerLoad } from './$types.js';
import { redisClient } from '$redis/redis.ts';
import { building } from '$app/environment';

let marketDatas: { data: { market: string; country: string }[] };

if (!building) {
	marketDatas = await supabase.from('markets').select('*').eq('status', true);
}

export const load: PageServerLoad = async () => {
	const marketPrice = Promise.all(
		marketDatas.data.map(async (data) => {
			const stringData: string | null = await redisClient.get(data.market);

			if (!stringData) {
				throw new Error('No data');
			}
			const price = JSON.parse(stringData);
			return { price, market: data.market, country: data.country };
		})
	);

	const priceResult = await marketPrice;

	return { price: priceResult };
};
