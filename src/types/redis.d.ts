declare global {
	interface Price {
		market: string;
		country: string;
		coin: string;
		price: number;
		timestamp: string;
	}
}

export {};
