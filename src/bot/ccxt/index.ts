import createMarketManager from './marketManager';

import { pro as ccxt, Exchange } from 'ccxt';
import moment from 'moment';
import { supabase } from '$db/db';
import { redisClient } from '$redis/redis';
import { WebSocketManager, RestManager } from './marketManager';

let managers: { [key: string]: { ws: WebSocketManager; rest: RestManager } } = {};
async function init() {
	// 현재 활성화 중인 코인 목록 데이터 가져오기
	const coinDatas = await supabase.from('coins').select('*').eq('status', true);

	// 현재 활성화 중인 마켓 목록 데이터 가져오기
	const marketDatas = await supabase.from('markets').select('*').eq('status', true);

	if (coinDatas.data && marketDatas.data) {
		const coins = coinDatas.data.map((coin) => coin.symbol);
		const markets = marketDatas.data;
		// 한국 마켓 비트코인 가격

		console.log(markets, coins);
		markets.map(async (market) => {
			managers[market.market] = await createMarketManager(
				market.market as keyof typeof ccxt,
				market.country
			);
		});
	}
	setInterval(() => {
		const used1 = process.memoryUsage().heapUsed / 1024 / 1024;
		console.log(`약 ${Math.round(used1 * 100) / 100} MB의 메모리를 사용중입니다.`);
	}, 1000);
}

init();

// import { setCoinList } from './coin';
// import { Market } from './market';

// export let priceData: any = {};

// // 코인 가격 가져오기 함수
// // err = 에러 있을 시 카운팅용
// export async function getPrice(market: string, symbols: string[], err = 0): Promise<void> {
// 	const NOW = moment().format('YY/MM/DD HH:mm:ss');
// 	const exchange: Exchange = new (ccxt as any)[market]();
// 	const limit = 5; // optional

// 	const ticker = await exchange.tickers(symbols).limit(limit);
// 	console.log(ticker);

// 	Object.values(ticker).map((t) => {
// 		if (t.last != null && t.symbol != null) {
// 			const coin = t.symbol.split('/')[0];
// 			const price = t.last;
// 			redisClient.HSET(`price:${market}`, coin, price);
// 			console.log(`${NOW} SUCCESS: ${market} 가격 불러오기 성공`);
// 			console.log(coin, price);
// 		}
// 	});

// 	// console.log(`${NOW} SUCCESS: ${market} 가격 불러오기 성공`);
// }
// export async function init() {
// 	// 현재 활성화 중인 코인 목록 데이터 가져오기
// 	const coinDatas = await supabase.from('coins').select('*').eq('status', true);

// 	// 현재 활성화 중인 마켓 목록 데이터 가져오기
// 	const marketDatas = await supabase.from('markets').select('*').eq('status', true);

// 	if (coinDatas.data && marketDatas.data) {
// 		const coins = coinDatas.data.map((coin) => coin.symbol);
// 		const markets = marketDatas.data;
// 		// 한국 마켓 비트코인 가격

// 		setCoinList(coins);

// 		markets.map((market) => {
// 			// 마켓 별로 객체 생성
// 			new Market(market.market, market.country);
// 		});
// 	}

// 	// setInterval(() => {
// 	// 	const used1 = process.memoryUsage().heapUsed / 1024 / 1024;
// 	// 	console.log(`약 ${Math.round(used1 * 100) / 100} MB의 메모리를 사용중입니다.`);
// 	// }, 1000);
// }

// console.log(await bybit.rest.getPrice(['BTC/USDT', 'ETH/USDT']));
