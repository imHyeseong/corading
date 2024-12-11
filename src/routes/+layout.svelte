<script module>
	import { io } from 'socket.io-client';
	import { PUBLIC_BASE_URL } from '$env/static/public';

	const socket: SocketClient = io(`${PUBLIC_BASE_URL}:8888/client`, {
		transports: ['websocket']
	});
	socket.on('connected', (address) => {
		console.log('connected', address);
	});
	socket.on('disconnected', () => {
		console.log('disconnected');
	});
</script>

<script lang="ts">
	import '../app.css';
	import * as Sidebar from '$ui/sidebar/index.js';
	import AppSidebar from '$components/AppSidebar.svelte';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { invalidate } from '$app/navigation';
	const { children, data } = $props();

	onMount(() => {
		console.log(data);
		invalidate('init:coins');
	});
	setContext('socket', socket);
	onDestroy(() => {
		socket.disconnect();
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
