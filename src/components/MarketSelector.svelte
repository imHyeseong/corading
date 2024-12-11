<script lang="ts">
	import * as Select from '$ui/select/index.ts';
	import type { SelectSingleRootProps } from 'bits-ui';

	type Props = {
		markets: any;
		country?: string;
	} & Partial<SelectSingleRootProps>;

	let { markets, country = $bindable(), ...restProps }: Props = $props();

	const imgErrorHandler = (e: Event) => {
		const target = e.target as HTMLImageElement;
		if (target) {
			target.src = '/logo/default.webp';
		}
	};
</script>

<Select.Root {...restProps} type="single" required bind:value={country}>
	<Select.Trigger>{country}</Select.Trigger>
	<Select.Content>
		{#each markets as market}
			<Select.Item value={market.market}>
				<p class="text-base font-bold">{market.market}</p>
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
