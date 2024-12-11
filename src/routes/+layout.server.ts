import { supabase } from '$db/db.ts';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ depends, locals, untrack }) => {
	depends('init:markets');
	depends('init:coins');
	try {
		return { markets: await getMarkets(), coins: await getCoins() };
	} catch (error) {
		console.error(error);
		return { error };
	}
};

const getMarkets = async () => {
	const markets = await supabase.from('markets').select('*').eq('status', true);

	return markets.data;
};

const getCoins = async () => {
	const coinReuslt = await supabase.from('coins').select('*').eq('status', true);

	return coinReuslt.data?.map((coin) => coin.symbol);
};
