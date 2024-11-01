import ccxt, { Exchange } from 'ccxt';
import moment from 'moment';

import { supabase } from '$db/db';
import { redisClient } from '$redis/redis';

// 코인 가격 가져오기 함수
// err = 에러 있을 시 카운팅용
async function fetchPrice(market: string, symbol: string[], err = 0): Promise<void> {
	const NOW = moment().format('YY/MM/DD HH:mm:ss');
	try {
		// todo: ccxt 타입 정의?
		const exchange: Exchange = new (ccxt as any)[market]();
		await exchange.loadMarkets();
		const ticker = await exchange.fetchTickers(symbol);

		const data = {
			market,
			price: {}
		};

		Object.values(ticker).map((t) => {
			data.price[t.symbol] = t.last;
		});

		await redisClient.set(market, JSON.stringify(data.price));

		console.log(`${NOW} SUCCESS: ${market} 가격 불러오기 성공`);
	} catch (error: any) {
		// 에러 존재시 에러 카운트 증가
		err++;
		console.error(`${NOW} ERROR - **${err}**: ${market} 가격 불러오기 실패 :`, error.message);
	} finally {
		// 에러 5번 이상 발생시 에러 출력 후 멈춤
		if (err >= 5) {
			console.error(`${NOW} ERROR - **STOP**: ${market} 에러 5회 이상 발생 `);
			return;
		}

		// 5초마다 코인 가격 가져오기
		setTimeout(() => {
			fetchPrice(market, symbol, err);
		}, 5000);
	}
}
async function comparePrices() {
	// 현재 활성화 중인 코인 목록 데이터 가져오기
	const coinDatas = await supabase.from('coins').select('*').eq('status', true);

	// 현재 활성화 중인 마켓 목록 데이터 가져오기
	const markets = await supabase.from('markets').select('*').eq('status', true);

	console.log(coinDatas);

	console.log(markets);

	if (coinDatas.data && markets.data) {
		const coins = coinDatas.data.map((coin) => coin.symbol);
		// 한국 마켓 비트코인 가격
		markets.data.map((market) => {
			// 한국 or 해외로 나눠서 coin에 접미어 추가
			const symbols =
				market.country == 'kor'
					? coins.flatMap((c) => `${c}/KRW`)
					: coins.flatMap((c) => `${c}/USDT`);
			fetchPrice(
				market.market,
				// 접미어 /KRW 추가
				symbols
			);
		});
	}
}

comparePrices();
