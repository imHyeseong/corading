import { pro as ccxt, coinbase } from 'ccxt';
import { supabase } from '$db/db';
import { HSET, publisher, redisClient } from '$redis/redis';
import moment from 'moment';
import { sleep } from '$lib/utils';

const market = process.env.name as string;
const country = process.argv[2];

// 국내 마켓은 spot (현물), 해외 마켓은 swap (선물) - linear
const options = {
	defaultType: country === 'intl' ? 'swap' : 'spot',
	...(country === 'intl' && { defaultMarket: 'linear' })
};

// 마켓으로 ccxt 인스턴스 생성
const exchange = new ccxt[market as keyof typeof ccxt](options);

// 코인 목록
let coins: string[] = [];
// 코인 심볼 목록
let symbols: string[] = [];
// 코인 심볼 목록 (무기한계약 - :USDT)
let symbols_trade: string[] = [];

const getCoinsWithSuffix = async () => {
	// 국내 마켓은 KRW, 해외 마켓은 USDT
	let suffix: string | null = country == 'kor' ? `/KRW` : '/USDT';

	// 국내 마켓은 현물이기때문에 x, 해외 마켓은 ccxt 방식으로 무기한 옵션 선물이기때문에 :USDT를 붙여줌
	let suffix2: string | null = country == 'kor' ? `` : ':USDT';

	let { data } = await supabase.from('coins').select('symbol').eq('status', true);

	if (data) {
		data.map((coin) => {
			coins.push(coin.symbol);
			symbols.push(coin.symbol + suffix);
			symbols_trade.push(coin.symbol + suffix + suffix2);
		});
	}

	suffix = null;
	suffix2 = null;
	data = null;
};

const watchTickers = async () => {
	while (true) {
		try {
			let result;

			if (market != 'bingx') {
				result = await exchange.watchTickers(symbols_trade, { limit: 1 });
			} else {
				result = await exchange.fetchTickers(symbols_trade);
			}

			Object.values(result).map((ticker) => {
				let info: any = {
					market,
					country,
					coin: ticker.symbol.split('/')[0],
					price: ticker.last,
					timestamp: moment()
				};

				let type: string | null = country == 'kor' ? 'spot' : 'swap';
				let hKey: string | null = `price:${info.coin}`;
				let hField: string | null = `market:${info.market}:type:${type}`;
				let hValue: string | null = JSON.stringify(info);

				HSET(hKey, hField, hValue);

				publisher.publish('price', hValue);
				hKey = null;
				hField = null;
				hValue = null;
				info = null;
			});
			result = null;
		} catch (e) {
			console.error(e);

			await sleep(3000);
			// stop the loop on exception or leave it commented to retry
			// throw e
		} finally {
			if (market == 'bingx') {
				await sleep(1000);
			}
		}
	}
};

const init = async () => {
	await getCoinsWithSuffix();

	watchTickers();
};

init();

setInterval(() => {
	const memoryUsage = process.memoryUsage();
	console.log('Memory Usage:', {
		rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
		heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
		heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
		external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`
	});
}, 5000);
