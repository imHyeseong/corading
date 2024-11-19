import { supabase } from '$db/db.ts';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async () => {
	try {
		const markets = await supabase.from('markets').select('*').eq('status', true);

		const coins = await supabase.from('coins').select('*').eq('status', true);
		return { coins: coins.data, markets: markets.data };
	} catch (error) {
		console.error(error);
		return { error };
	}
};
