<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$ui/card/card.svelte';
	import CardBot from './components/CardBot.svelte';
	import CardPrice from './components/CardPrice.svelte';
	import MarketSelector from '$components/MarketSelector.svelte';
	import ArrowRightLeft from 'lucide-svelte/icons/arrow-right-left';
	import { page } from '$app/stores';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	const { data } = $props();

	let kor = $state('upbit');
	let intl = $state('binance');

	$effect(() => {
		goto(`?kor=${kor}&intl=${intl}`, { noScroll: true });
	});

	const searchParams = new SvelteURLSearchParams($page.url.searchParams);

	$effect(() => {
		console.log(searchParams);
	});
</script>

<div class="grid max-h-dvh w-full grid-cols-2 grid-rows-2 gap-2">
	<Card class="h-full space-y-3 ">
		<div class="flex items-center gap-4">
			<MarketSelector
				bind:country={kor}
				markets={data.markets?.filter((market) => market.country == 'kor')}
			/>
			<ArrowRightLeft />
			<MarketSelector
				bind:country={intl}
				markets={data.markets?.filter((market) => market.country == 'intl')}
			/>
		</div>

		<CardPrice {data} {kor} {intl} />
	</Card>

	<CardBot {data} />
</div>
