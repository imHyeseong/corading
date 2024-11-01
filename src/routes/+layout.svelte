<script lang="ts">
	import '../app.css';
	import Theme from '$components/Theme.svelte';
	import * as Sidebar from '$ui/sidebar/index.js';
	import AppSidebar from '$components/AppSidebar.svelte';
	import { onMount } from 'svelte';
	import { marketState } from '$stores/market.svelte.js';
	const { children, data } = $props();

	onMount(() => {
		const { marketDatas } = data;
		marketDatas.data.forEach((item) => {
			marketState.set(item.market, item.country || 'Intl');
		});

		console.log(marketState);
	});
</script>

<Sidebar.Provider class="gap-3">
	<AppSidebar />
	<main>
		{@render children?.()}
	</main>
</Sidebar.Provider>

<style lang="postcss">
	#layout {
		@apply flex h-dvh w-dvw;
	}
	nav {
		@apply h-full w-20;
	}
</style>
