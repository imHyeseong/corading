<!-- <script lang="ts">
	import type { PageData } from '../$types';
	import { coins } from '$stores/globals';

	const { data }: { data: PageData } = $props();

	type Price = {
		kor: { [key: string]: number };
		intl: { [key: string]: number };
	};

	let intl = $state(data.pair?.intl.market ?? 'binance');
	let kor = $state(data.pair?.kor.market ?? 'upbit');

	let price = $state<Price>();

	const tableData = $derived.by(() => {
		if (!price) return [];

		return $coins.map((coin) => {
			const kor_price = Number(price?.kor[coin] ?? 0);
			const intl_price = Number(price?.intl[coin] ?? 0);
			return {
				coin,
				price: {
					kor: kor_price,
					intl: intl_price
				},
				tether: kor_price / intl_price
			};
		});
	});

	// onMount(() => {

	// 	let interval = setInterval(() => {
	// 		updatePrice();
	// 	}, 5000);

	// 	return () => {
	// 		clearInterval(interval);
	// 	};
	// });

	$effect(() => {
		if (kor && intl) {
			updatePrice();
		}
	});

	const updatePrice = () => {
		console.log(kor);
		fetch(`/api/price/${kor}`).then(async (res) => {
			const data = await res.json();
			if (data.success && price) {
				price.kor = data.price;
			}
		});
		fetch(`/api/price/${intl}`).then(async (res) => {
			const data = await res.json();
			if (data.success && price) {
				price.intl = data.price;
			}
		});
	};
</script> -->
