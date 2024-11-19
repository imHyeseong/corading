<script>
	import { Card } from '$ui/card';
	import ArrowRightLeft from 'lucide-svelte/icons/arrow-right-left';
	import MarketSelector from './components/MarketSelector.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const { data, children } = $props();

	let kor = $state('upbit');
	let intl = $state('binance');

	$effect(() => {
		goto(`?kor=${kor}&intl=${intl}`);
	});
</script>

<Card class="space-y-3">
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
	{@render children()}
	<!-- <DataTable {columns} data={tableData} /> -->
</Card>
