import { SvelteSet } from 'svelte/reactivity';
let coins = new SvelteSet<string>();
let marketIntls = new SvelteSet<string>();
let marketKors = new SvelteSet<string>();

let markets = $derived({ intl: marketIntls, kor: marketKors });

export const addCoin = (coin: string) => {
	if (!coins.has(coin)) {
		coins.add(coin);
	}
};

export const addMarket = (market: string, country: string) => {
	if (country === 'kor' && !marketKors.has(market)) {
		marketKors.add(market);
	} else if (country === 'intl' && !marketIntls.has(market)) {
		marketIntls.add(market);
	}
};

// Getter functions
export const getCoins = () => coins;
export const getMarketIntls = () => marketIntls;
export const getMarketKors = () => marketKors;
export const getAllMarkets = () => markets;

export const svelteFetch = async (url: string) => {
	const baseUrl = import.meta.env.BASE_URL;
	const result = await fetch(baseUrl + url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	});
	const data = await result.json();

	console.log(data);
	return data;
};
