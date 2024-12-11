import { getPrice, redisClient } from '$redis/redis';
import { fail, type Actions } from '@sveltejs/kit';
import type { ActionData, PageServerLoad } from './$types';
import { supabase } from '$db/db';
import { getContext } from 'svelte';
export const load: PageServerLoad = async ({ url, parent, depends }) => {
	depends('init:coins');
	const kor = url.searchParams.get('kor') || 'upbit';
	const intl = url.searchParams.get('intl') || 'binance';

	const data = await parent();

	const { coins } = data;

	const korPrices = new Map<string, number>();

	const intlPrices = new Map<string, number>();

	if (!coins) return { kor, intl, price: { kor: null, intl: null } };

	await Promise.all(
		coins?.map(async (coin) => {
			const korPrice = await getPrice(kor, 'spot', coin);
			const intlPrice = await getPrice(intl, 'swap', coin);

			if (korPrice && intlPrice) {
				korPrices.set(coin, korPrice as number);
				intlPrices.set(coin, intlPrice as number);
			}
		})
	);

	return { kor, intl, price: { kor: korPrices, intl: intlPrices } };
};

export const actions: Actions = {
	generateGimp: async ({ request }) => {
		const form: any = Object.fromEntries(await request.formData());
		const { coin, kor_market, intl_market, qty, entry_tether, exit_tether } = form;
		const result = await supabase
			.from('tx_gimp')
			.insert({ user_id: 1, coin, kor_market, intl_market, qty, entry_tether, exit_tether })
			.select();

		if (result.error) {
			return fail(500, { message: result.error.message });
		} else {
			const { data } = result;
			if (data.length < 1) {
				return { success: false, message: '목표 생성에 실패하였습니다.' };
			}

			const targetKey = `gimp:entry:${coin}:${kor_market}:${intl_market}`;

			const value = {
				user_id: data[0].user_id,
				tx_id: data[0].id
			};
			await redisClient.ZADD(targetKey, {
				score: Number(entry_tether),
				value: JSON.stringify(value)
			});

			return { success: true, data: result.data };
		}
	}
};
