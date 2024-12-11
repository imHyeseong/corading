import {
	MainClient,
	WebsocketClient,
	DefaultLogger,
	isWsFormattedMarkPriceUpdateEvent,
	isWsPartialBookDepthEventFormatted,
	isWsFormatted24hrTicker
} from 'binance';
import { supabase } from '$db/db';
import { HSET, publisher } from '$redis/redis';
import moment from 'moment';
import { RestClientV5 } from 'bybit-api';

const market = 'binance';
const country = process.argv[2];

// API 키 설정
const API_KEY = process.env.BINANCE_API_KEY as string;
const API_SECRET = process.env.BINANCE_API_SECRET as string;

const logger = DefaultLogger;
// WebSocket 클라이언트 설정
const wsClient = new WebsocketClient(
	{
		wsUrl: 'wss://fstream.binance.com', // 선물 웹소켓 URL
		beautify: true
	},
	logger
);

const restClient = new RestClientV5({});
// 코인 목록
let coins: string[] = [];
// 코인 심볼 목록
let symbols: string[] = [];

let decimals: Record<string, number> = {};

const getCoinsWithSuffix = async () => {
	let { data } = await supabase.from('coins').select('symbol, intl_decimal').eq('status', true);

	if (data) {
		data.map((coin) => {
			coins.push(coin.symbol);
			symbols.push(coin.symbol + 'USDT');
			decimals[coin.symbol] = coin.intl_decimal;
		});
	}

	data = null;
};

const watchTickers = async () => {
	// WebSocket 에러 핸들링
	wsClient.on('error', (err) => {
		console.error('WebSocket 에러:', err);
	});

	// 자동 재연결 알림
	wsClient.on('reconnecting', (data) => {
		console.log('WebSocket 재연결 중...', data?.wsKey);
	});

	// 재연결 완료 알림
	wsClient.on('reconnected', (data) => {
		console.log('WebSocket 재연결됨', data?.wsKey);
	});

	// 무기한 계약 선 마켓 구독
	symbols.forEach((symbol) => {
		console.log('zz');
		console.log(symbol);
		wsClient.subscribeSymbolBookTicker(symbol, 'usdm');
	});

	wsClient.on('formattedMessage', (data) => {
		if ((data.eventType = 'bookTicker')) {
			try {
				const markPrice = (data.bidPrice + data.askPrice) / 2;
				const coin = data.symbol.replace('USDT', '');
				const info = {
					market,
					country,
					coin,
					price: Number(markPrice.toFixed(decimals[coin])),
					timestamp: data.eventTime
				};

				const type = country === 'kor' ? 'spot' : 'swap';
				const hKey = `price:${info.coin}`;
				const hField = `market:${market}:type:${type}`;
				const hValue = JSON.stringify(info);

				HSET(hKey, hField, hValue);
				publisher.publish('price', hValue);
			} catch (e) {
				console.error('메시지 처리 중 에러:', e);
			}
		}
	});
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
