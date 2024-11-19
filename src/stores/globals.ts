import { writable } from 'svelte/store';

type Coin = {
	id: number;
	symbol: string;
	status: boolean;
};

type Market = {
	id: number;
	market: string;
	country: string;
	status: boolean;
};
export const markets = writable<Market[]>([]);

export const coins = writable<Coin[]>([]);
