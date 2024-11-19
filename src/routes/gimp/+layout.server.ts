import { supabase } from '$db/db';
import type { LayoutServerLoad } from './$types';

type PairResponse = {
	kor: { market: string };
	intl: { market: string };
};

export const load: LayoutServerLoad = async ({}) => {
	try {
		const pair = await supabase
			.from('primary_pair')
			.select('kor(market),intl(market)')
			.returns<PairResponse[]>()
			.single();
		return { pair: pair.data };
	} catch (error) {
		console.error(error);
		return { error };
	}
};
