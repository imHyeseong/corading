<script module>
	import { io } from 'socket.io-client';
	const socket = io('http://localhost:8888/client', { transports: ['websocket'] });

	socket.on('connect', () => {
		console.log('connected to socket');
	});
</script>

<script lang="ts">
	import '../app.css';
	import * as Sidebar from '$ui/sidebar/index.js';
	import AppSidebar from '$components/AppSidebar.svelte';
	import { onMount, setContext } from 'svelte';
	import { coins, markets } from '$stores/globals.js';
	const { children, data } = $props();

	setContext('socket', socket);
	onMount(() => {
		if (data.error) {
			console.error(data.error);
		} else {
			coins.set(data.coins ?? []);
			markets.set(data.markets ?? []);
		}

		return () => {
			socket.disconnect();
		};
	});
</script>

<Sidebar.Provider class="gap-3">
	<AppSidebar />
	<main class="w-full p-5">
		<div class="h-full w-full rounded-md bg-muted p-5 shadow-md">
			{@render children?.()}
		</div>
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
