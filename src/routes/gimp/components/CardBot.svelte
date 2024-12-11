<script lang="ts">
	import CoinSelector from '$components/CoinSelector.svelte';
	import Card from '$ui/card/card.svelte';
	import Input from '$ui/input/input.svelte';
	import Label from '$ui/label/label.svelte';
	import type { PageData } from '../$types';
	import MarketSelector from '$components/MarketSelector.svelte';

	const { data }: { data: PageData } = $props();

	let entry_tether = $state(0);
	let exit_tether = $state(0);
	let qty = $state(0);
</script>

<Card class="space-y-3">
	<form class="grid grid-cols-2 gap-3" method="post" action="?/generateGimp">
		<div class="col-span-2">
			<Label class="m-2 text-green-500">코인</Label>
			<CoinSelector required coins={data.coins} name="coin" />
		</div>
		<div class="col-span-2 flex gap-3">
			<div class="w-full">
				<Label class="m-2 text-blue-500">국내 거래소</Label>
				<MarketSelector
					required
					name="kor_market"
					markets={data.markets?.filter((market) => market.country == 'kor')}
				/>
			</div>
			<div class="w-full">
				<Label class="m-2 text-red-500">해외 거래소</Label>
				<MarketSelector
					required
					name="intl_market"
					markets={data.markets?.filter((market) => market.country == 'intl')}
				/>
			</div>
		</div>
		<div>
			<Label class="ml-2">구매 수량</Label>
			<Input required bind:value={qty} type="number" name="qty" />
		</div>
		<div>
			<Label class="ml-2">목표 진입가</Label>
			<Input
				required
				bind:value={entry_tether}
				type="number"
				max={2000}
				min={1000}
				name="entry_tether"
			/>
		</div>

		<div>
			<Label class="ml-2">목표 판매가</Label>
			<Input
				required
				bind:value={exit_tether}
				type="number"
				max={2000}
				min={1000}
				name="exit_tether"
			/>
		</div>

		<div>
			<button type="submit" class=" rounded-lg bg-primary/50 p-2 font-bold text-white">
				거래 생성
			</button>
		</div>
	</form>
</Card>
