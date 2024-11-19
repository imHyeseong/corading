<script lang="ts">
	import * as Select from '$ui/select/index.ts';

	type Props = {
		markets: any;
		country: string;
	};

	let { markets, country = $bindable() }: Props = $props();

	const imgErrorHandler = (e: Event) => {
		const target = e.target as HTMLImageElement;
		if (target) {
			target.src = '/logo/default.webp';
		}
	};
</script>

<Select.Root type="single" required bind:value={country}>
	<Select.Trigger>{country}</Select.Trigger>
	<Select.Content>
		{#each markets as market}
			<Select.Item value={market.market} class="flex items-center justify-between gap-2">
				<p>{market.market}</p>
				<img
					src={`/logo/${market.market}.webp`}
					onerror={imgErrorHandler}
					loading="lazy"
					alt={market.market}
					class="w-10"
				/>
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
