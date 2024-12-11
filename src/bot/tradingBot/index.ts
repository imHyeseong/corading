import { supabase } from '$db/db';
import { getPrice, redisClient, subscriber } from '$redis/redis';
import { binance, pro as ccxt, Exchange } from 'ccxt';
import moment from 'moment';

const user_id = process.argv[2];

interface RestClients {
	[key: string]: Exchange;
}

let restClients: RestClients = {};

const init = async () => {
	const { data: apiList } = await supabase.from('user_api').select('*');

	apiList?.map(async (api) => {
		console.log(api.market);
		restClients[api.market] = new (ccxt as any)[api.market]();
		restClients[api.market].apiKey = api.access;
		restClients[api.market].secret = api.secret;
		if (api.market === 'okx') {
			restClients[api.market].password = process.env.OKX_PASSWORD as string;
		}
		if (api.market === 'bitmart') {
			restClients[api.market].uid = api.uid as string;
		}
	});

	subscriber.subscribe(`gimp:entry:user:${user_id}`, async (message) => {
		const { key, value } = JSON.parse(message);

		// 짧은시간에 여러번 발생하는 경우를 대비해 redis에서 삭제 성공시( 단 한번 )만 실행
		const isDel = await redisClient.zRem(key, JSON.stringify(value));
		if (isDel) {
			const { data: tx } = await supabase.from('tx_gimp').select('*').eq('id', value.tx_id);
			if (tx && tx.length > 0) {
				const { intl_market, kor_market, coin, qty, entry_tether, user_id } = tx[0];

				// 해외 마켓 잔고 조회 - USDT
				const intl_balance = await restClients[intl_market].fetchFreeBalance();
				// 해외 마켓 현재가 조회
				const intl_price = (await getPrice(intl_market, 'swap', coin, {
					raw: true
				})) as Price | null;

				// 국내 마켓 잔고 조회 - KRW
				const kor_balance = await restClients[kor_market].fetchFreeBalance();
				// 국내 마켓 현재가 조회
				const kor_price = (await getPrice(kor_market, 'spot', coin, {
					raw: true
				})) as Price | null;

				if (intl_balance && kor_balance && intl_price && kor_price) {
					const USDT = intl_balance['USDT'];
					const KRW = kor_balance['KRW'];

					console.log(USDT, ' - ', KRW);
					if (checkUpdateTime(intl_price.timestamp) && checkUpdateTime(kor_price.timestamp)) {
						const isBuyable =
							checkBuyableQty(USDT, intl_price.price, qty) &&
							checkBuyableQty(KRW, kor_price.price, qty);
						if (isBuyable) {
							console.log('구매 가능');
						}
					}
				}
			}
		}
	});
};

init();

const checkBuyableQty = (balance: number, price: number, qty: number) => {
	const SAFE_AMOUNT = 0.95;
	const buyableQty = (balance * SAFE_AMOUNT) / price;

	console.log(buyableQty, ' - ', qty);
	return buyableQty >= qty;
};

const checkUpdateTime = (timestamp: string, seconds: number = 15) => {
	const now = moment();
	const updateTime = moment(timestamp);
	console.log(now, ' - ', updateTime);
	console.log(now.diff(updateTime, 'seconds'));

	return now.diff(updateTime, 'seconds') <= 15;
};
