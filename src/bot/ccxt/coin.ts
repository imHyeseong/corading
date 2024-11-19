import { redisClient } from '$redis/redis';

let coins: string[] = [];

export let setCoinList = (coinDatas: any[]) => {
	console.log(coinDatas);
	coinDatas.map((coin) => {
		redisClient.SADD('coin', coin);
		coins.push(coin);
	});
};

export let getCoinList = () => {
	return coins;
};
