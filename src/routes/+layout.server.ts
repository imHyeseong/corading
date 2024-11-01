import { supabase } from '$db/db.ts';
import type { LayoutServerLoad } from './$types.js';
import { redisClient } from '$redis/redis.ts';
import type {  PostgrestSingleResponse } from '@supabase/supabase-js';
let marketDatas:PostgrestSingleResponse<{
    country: string | null;
    id: number;
    market: string;
    status: boolean | null;
}[]>

export const load: LayoutServerLoad = async () => {
	marketDatas = await supabase.from('markets').select('*').eq('status', true);

	if (!marketDatas.data) {
		throw new Error('No market data available');
	}

	console.log(marketDatas);


	return { marketDatas };
};
