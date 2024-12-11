<script lang="ts">
	import * as Select from '$ui/select/index.ts';
	import type { SelectSingleRootProps } from 'bits-ui';

	type Props = {
		coins: any;
		coin?: string;
	} & Partial<SelectSingleRootProps>;

	let { coins, coin = $bindable(), ...restProps }: Props = $props();
</script>

<Select.Root {...restProps} type="single" required bind:value={coin}>
	<Select.Trigger>{coin}</Select.Trigger>
	<Select.Content>
		{#each coins as v}
			<Select.Item value={v}>
				<p class="text-base font-bold">{v}</p>
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
