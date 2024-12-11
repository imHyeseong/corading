import { supabase } from '$db/db';
import { getAllPrice, HSET, publisher, redisClient, subscriber } from '$redis/redis';
import { truncateDecimal } from '$lib/utils';

const { data: kr } = await supabase.from('markets').select('market').eq('country', 'kor');
const excludes = kr?.map((market) => market.market) || ['upbit', 'bithumb'];

subscriber.subscribe('price', async (message) => {
	// data = 한국 거래소 관련 데이터
	const data = JSON.parse(message);

	if (data.country == 'intl') {
		return;
	}

	const { coin } = data;

	const prices = await getAllPrice(coin);

	const intlPrices = prices.filter((price) => !excludes.includes(price.market));

	// data.market = 한국 거래소 / data.price = 한국 거래소 가격
	// market = 외국 거래소 / price = 외국 거래소 가격
	intlPrices.map(async ({ market, price }) => {
		const tether = truncateDecimal(data.price / price, 2);
		const key = `tether:${coin}`;
		const field = `${data.market}:${market}`;

		HSET(key, field, tether);

		const targetKey = `gimp:entry:${coin}:${data.market}:${market}`;
		const targets = await redisClient.ZRANGEBYSCORE(targetKey, tether, '+inf');

		if (targets.length > 0) {
			targets.map((target) => {
				const value = JSON.parse(target);

				const message = {
					key: targetKey,
					value
				};
				publisher.publish(`gimp:entry:user:${value.user_id}`, JSON.stringify(message));
			});
		}
	});
});
