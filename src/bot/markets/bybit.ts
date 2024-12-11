import { WebsocketClient } from 'bybit-api';
import { supabase } from '$db/db';
import { HSET, publisher } from '$redis/redis';
import moment from 'moment';

const market = 'bybit';
const country = process.argv[2];

// WebSocket 클라이언트 설정
const wsClient = new WebsocketClient({
	// key: "xxx",
	// secret: "xxx",
	market: 'v5'
});

// 코인 목록
let coins: string[] = [];
// 코인 심볼 목록
let symbols: string[] = [];

const getCoinsWithSuffix = async () => {
	let { data } = await supabase.from('coins').select('symbol, intl_decimal').eq('status', true);

	if (data) {
		data.map((coin) => {
			coins.push(coin.symbol);
			symbols.push(coin.symbol + 'USDT');
		});
	}

	data = null;
};

const watchTickers = async () => {
	console.log(symbols);
	// WebSocket 에러 핸들링
	wsClient.on('error', (err) => {
		console.error('WebSocket 에러:', err);
	});

	// 연결 성공 알림
	wsClient.on('open', () => {
		console.log('WebSocket 연결됨');
		// 선물 마켓 구독
		symbols.forEach((symbol) => {
			wsClient.subscribeV5([`orderbook.50.${symbol}`], 'linear');
		});
	});

	// 메시지 수신 및 처리
	wsClient.on('update', (data: any) => {
		console.log(data);
		try {
			if (data.topic?.startsWith('orderbook.50.') && data.data?.b && data.data?.b[0]) {
				const symbol = data.data.s;
				let markPrice = 0;
				if (!data.data.b[0]) {
					markPrice = data.data.a[0][0];
					console.log('a');
				} else if (!data.data.a[0]) {
					markPrice = data.data.b[0][0];
					console.log('b');
				} else {
					markPrice = (Number(data.data.b[0][0]) + Number(data.data.a[0][0])) / 2;
					console.log('c');
				}
				console.log(markPrice);

				const info = {
					market,
					country,
					coin: symbol.replace('USDT', ''),
					price: parseFloat(data.data.b[0][0]), // 최상위 매수 호가
					timestamp: moment()
				};

				const type = country === 'kor' ? 'spot' : 'swap';
				const hKey = `price:${info.coin}`;
				const hField = `market:${market}:type:${type}`;
				const hValue = JSON.stringify(info);

				HSET(hKey, hField, hValue);
				publisher.publish('price', hValue);
			}
		} catch (e) {
			console.error('메시지 처리 중 에러:', e);
		}
	});

	wsClient.on('response', (response) => {
		console.log('응답:', response);
	});

	wsClient.on('error', (err) => {
		console.error('에러:', err);
	});
	wsClient.connectPublic();
};

const init = async () => {
	await getCoinsWithSuffix();
	watchTickers();
};

init();

// 메모리 사용량 모니터링
setInterval(() => {
	const memoryUsage = process.memoryUsage();
	console.log('메모리 사용량:', {
		rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
		heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
		heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
		external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`
	});
}, 5000);
