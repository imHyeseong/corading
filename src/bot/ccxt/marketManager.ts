import { Exchange, pro as ccxt, type Ticker } from 'ccxt';

const getQuoteSymbol = (exchange: Exchange) => {
	return exchange.options.defaultType === 'swap'
		? 'USDT'
		: exchange instanceof ccxt.upbit || exchange instanceof ccxt.bithumb
			? 'KRW'
			: 'USDT';
};
const getFormattedSymbol = (symbol: string, exchange: Exchange) => {
	return exchange.options.defaultType === 'swap' ? `${symbol}:${getQuoteSymbol(exchange)}` : symbol;
};

interface MarketConfig {
	country: string;
	marketName: keyof typeof ccxt;
}

export class RestManager {
	protected exchange: Exchange;

	constructor({ country, marketName }: MarketConfig) {
		const exchangeClass = ccxt[marketName];
		if (!exchangeClass) {
			throw new Error(`지원하지 않는 거래소입니다: ${marketName}`);
		}

		this.exchange = new exchangeClass({
			enableRateLimit: true,
			options: {
				defaultType: country === 'intl' ? 'swap' : 'spot',
				...(country === 'intl' && { defaultMarket: 'linear' })
			}
		});
	}

	getPrice = async (coins: string[]) => {
		const symbols = coins.map((coin) => {
			return `${coin}/${getQuoteSymbol(this.exchange)}`;
		});
		try {
			// 심볼 형식 변환
			const formattedSymbols = symbols.map((symbol) => getFormattedSymbol(symbol, this.exchange));

			return await this.exchange.fetchTickers(formattedSymbols);
		} catch (error) {
			console.error('가격 조회 중 오류 발생:', error);
			throw error;
		}
	};
}

export class WebSocketManager {
	protected exchange: Exchange;
	protected activeTopics: Set<string>;
	protected isRunning: boolean;

	constructor({ country, marketName }: MarketConfig) {
		const exchangeClass = ccxt[marketName];
		if (!exchangeClass) {
			throw new Error(`지원하지 않는 거래소입니다: ${marketName}`);
		}

		this.exchange = new exchangeClass({
			enableRateLimit: true,
			options: {
				defaultType: country === 'intl' ? 'swap' : 'spot',
				...(country === 'intl' && { defaultMarket: 'linear' })
			}
		});
		this.activeTopics = new Set();
		this.isRunning = false;
	}

	public subscribe = async (coins: string[]): Promise<void> => {
		const symbols = coins.map((coin) => `${coin}/${getQuoteSymbol(this.exchange)}`);
		const formattedSymbols = symbols.map((symbol) => getFormattedSymbol(symbol, this.exchange));
		formattedSymbols.forEach((symbol) => this.activeTopics.add(symbol));

		console.log(await this.exchange.loadMarkets());
		if (!this.isRunning) {
			this.isRunning = true;
			this.watchTickers();
		}
	};

	public getActiveSubscriptions = (): string[] => {
		return Array.from(this.activeTopics);
	};

	protected watchTickers = async (): Promise<void> => {
		while (this.isRunning && this.activeTopics.size > 0) {
			try {
				for (const symbol of this.activeTopics) {
					const ticker = await this.exchange.watchTicker(symbol);
					this.handleUpdate(ticker);
				}
			} catch (error) {
				console.error('웹소켓 에러:', error);
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}
	};

	protected handleUpdate = (ticker: Ticker): void => {
		console.log(this.exchange.id);
		console.log(`심볼: ${ticker.symbol}`);
		console.log(`현재가: ${ticker.last}`);
		console.log(`24시간 고가: ${ticker.high}`);
		console.log(`24시간 저가: ${ticker.low}`);
		console.log(`24시간 거래량: ${ticker.baseVolume}`);
		console.log(`24시간 거래대금: ${ticker.quoteVolume}`);
		console.log('------------------------');
	};

	public destroy = async (): Promise<void> => {
		this.isRunning = false;
		this.activeTopics.clear();
		await this.exchange.close();
	};
}

// 사용 예시:
const createMarketManager = (marketName: keyof typeof ccxt, country: string) => {
	const ws = new WebSocketManager({ country, marketName });
	const rest = new RestManager({ country, marketName });
	return { ws, rest };
};
export default createMarketManager;
