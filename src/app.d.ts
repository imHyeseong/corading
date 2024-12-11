// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: number;
		}
		// interface PageData {}
		// interface Platform {}
		interface Actions {
			generateGimp: (data: {
				coin: string;
				kor_market: string;
				intl_market: string;
				qty: number;
				entry_tether: number;
				exit_tether: number;
			}) => void;
		}
	}
}

export {};
