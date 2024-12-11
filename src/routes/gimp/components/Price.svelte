<script lang="ts">
	import { svelteFetch } from '$lib/svelteFetch';
	import { getContext } from 'svelte';

	let price = $state(0);

	let { setPrice, market, country, coin } = $props();

	const socket: SocketClient = getContext('socket');

	$effect(() => {
		(async () => {
			const event = `${market}:${coin}`;
			const type = country === 'kor' ? 'spot' : 'swap';
			const result = await svelteFetch.get(`/api/price/${market}/${coin}`, { type });

			if (result.success) {
				price = result.price;

				setPrice(market, coin, price);
			}
			socket.on(event, (data) => {
				price = data.price;
				setPrice(market, coin, price);
			});
		})();
	});
</script>

{price}
