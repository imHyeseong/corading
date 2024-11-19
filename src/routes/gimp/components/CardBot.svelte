<!-- <script lang="ts">
	import { redisClient } from '$redis/redis';
	import Card from '$ui/card/card.svelte';
	import Input from '$ui/input/input.svelte';
	import Label from '$ui/label/label.svelte';
	import type { PageData } from '../$types';
	import MarketSelector from './MarketSelector.svelte';

	const { data }: { data: PageData } = $props();

	let kor = $state(data.pair?.kor ?? 'upbit');

	let intl = $state(data.pair?.intl ?? 'binance');

	let entry_tether = $state(0);
	let exit_tether = $state(0);
	let qty = $state(0);
</script>

<Card class="space-y-3">
	<div class="flex gap-3">
		<div class="w-full">
			<Label class="m-2 text-blue-500">국내 거래소</Label>
			<MarketSelector country={kor} markets={data.markets.kor} />
		</div>
		<div class="w-full">
			<Label class="m-2 text-red-500">해외 거래소</Label>
			<MarketSelector country={intl} markets={data.markets.intl} />
		</div>
	</div>
	<form class="grid grid-cols-2 gap-3">
		<div>
			<Label class="ml-2">목표 진입가</Label>
			<Input bind:value={entry_tether} type="number" max={2000} min={1000} />
		</div>

		<div>
			<Label class="ml-2">목표 판매가</Label>
			<Input bind:value={exit_tether} type="number" max={2000} min={1000} />
		</div>
		<div>
			<Label class="ml-2">구매 수량</Label>
			<Input bind:value={qty} type="number" />
		</div>
	</form>
</Card> -->
