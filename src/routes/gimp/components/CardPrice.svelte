<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import Price from './Price.svelte';
	const { data, kor, intl } = $props();

	const socket: SocketClient = getContext('socket');

	$effect(() => {
		const rooms = [`price:${kor}`, `price:${intl}`];
		socket.emit('join', rooms);

		return () => {
			socket.emit('leave', rooms);
		};
	});
	onDestroy(() => {
		socket.emit('leave', [kor, intl]);
	});

	const coins: string[] = $derived(data.coins);

	let prices: Record<string, number[]> = $state({});

	let tethers: Record<string, string> = $state({});

	$effect.root(() => {
		coins?.map((coin) => {
			tethers[coin] = '0';
		});

		$effect(() => {
			const temp: Record<string, string> = {};

			coins?.map((coin) => {
				temp[coin] = '0';
			});
			Object.entries(prices).forEach(([coin, price]) => {
				const tether = price[0] / price[1] || 0;
				if (tether === 0) {
					return;
				}
				(temp as Record<string, string>)[coin] = tether.toLocaleString('ko-KR', {
					minimumFractionDigits: 1,
					maximumFractionDigits: 1
				});
			});
			tethers = temp;
		});
	});

	const setPrice = (market: string, coin: string, price: number) => {
		if (!prices[coin]) {
			prices[coin] = [];
		}
		if (market === kor) {
			prices[coin][0] = price;
		} else {
			prices[coin][1] = price;
		}
	};
</script>

<div class="flex w-full flex-col gap-1 overflow-y-auto rounded-lg bg-primary/20 p-2">
	<div class="coin_price">
		<p class="header">Coin</p>
		<p class="header">Price</p>
		<p class="header">Tether</p>
	</div>
	{#each Object.entries(tethers) as [coin, tether], index}
		<div class="coin_price gap-1">
			<p class="flex items-center justify-center">{coins.find((c) => c === coin)}</p>
			<div class=" text-right">
				<p class="border-b p-1 text-primary">
					<Price {setPrice} market={kor} country="kor" coin={coins.find((c) => c === coin)} />
				</p>
				<p class="p-1">
					<Price {setPrice} market={intl} country="intl" coin={coins.find((c) => c === coin)} />
				</p>
			</div>
			<p class="flex items-center justify-end p-2">{tether}</p>
		</div>
	{/each}
</div>

<style lang="postcss">
	.coin_price {
		@apply grid w-full items-center rounded-lg;
		grid-template-columns: 1fr 2fr 1fr;
	}

	.coin_price > * {
		@apply h-full rounded-lg bg-background;
	}
	.header {
		@apply rounded-lg !bg-transparent py-1 text-center text-primary;
	}
	p {
		@apply font-bold;
	}
</style>
