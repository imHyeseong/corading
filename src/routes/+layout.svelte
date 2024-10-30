<script lang="ts">
	import '../app.css';
	import Theme from '$components/Theme.svelte';
	import * as Sidebar from '$ui/sidebar/index.js';
	import AppSidebar from '$components/AppSidebar.svelte';
	const { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Trigger />
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
