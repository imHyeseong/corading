module.exports = {
	apps: [
		{
			name: 'socket',
			script: 'src/bot/socket/index.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',

			max_memory_restart: '1G'
		},
		{
			name: 'dev',
			script: 'pnpm dev',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',
			watch: ['src/**/*.*']
		},
		{
			name: 'tetherMaker',
			script: 'src/bot/tetherMaker/index.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',

			max_memory_restart: '1G'
		},
		{
			name: 'upbit',
			script: 'src/bot/ccxt/index.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',

			max_memory_restart: '500M',
			args: ['kor']
		},
		{
			name: 'bithumb',
			script: 'src/bot/ccxt/index.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',

			max_memory_restart: '500M',
			args: ['kor']
		},

		{
			name: 'binance',
			script: 'src/bot/markets/binance.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',

			max_memory_restart: '500M',
			args: ['intl']
		},
		{
			name: 'bybit',
			script: 'src/bot/markets/bybit.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',

			max_memory_restart: '500M',
			args: ['intl']
		},
		{
			name: 'bitmart',
			script: 'src/bot/ccxt/index.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',

			max_memory_restart: '500M',
			args: ['intl']
		},
		{
			name: 'gate',
			script: 'src/bot/ccxt/index.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',

			max_memory_restart: '500M',
			args: ['intl']
		},
		{
			name: 'okx',
			script: 'src/bot/ccxt/index.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',

			max_memory_restart: '500M',
			args: ['intl']
		},
		{
			name: 'mexc',
			script: 'src/bot/ccxt/index.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',

			max_memory_restart: '500M',
			args: ['intl']
		},
		{
			name: 'bingx',
			script: 'src/bot/ccxt/index.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',

			max_memory_restart: '500M',
			args: ['intl']
		},
		{
			name: 'tradingBot_1',
			script: 'src/bot/tradingBot/index.ts',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			log_max_size: '10M',
			args: [1],

			max_memory_restart: '500M'
		}
	]
};
