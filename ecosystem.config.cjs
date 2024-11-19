module.exports = {
	apps: [
		{
			name: 'ccxt',
			script: 'src/bot/ccxt/index.ts'
		},
		{
			name: 'socket',
			script: 'src/bot/socket/index.ts'
		}
	]
};
