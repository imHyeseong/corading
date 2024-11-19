<script lang="ts">
	import { page } from '$app/stores';
	import { getContext, onMount } from 'svelte';
	import CardBot from './components/CardBot.svelte';
	import CardPrice from './components/CardPrice.svelte';
	const { data } = $props();

	$effect(() => {
		console.log(data.kor, data.intl);
	});

	const socket = getContext('socket');

	onMount(() => {
		socket.emit('join', { room: data.kor });
	});
</script>

<div class=" grid w-full grid-cols-2 gap-3">
	<!-- <CardPrice {data} /> -->

	<!-- <CardBot {data} /> -->
</div>

<style lang="postcss">
</style>
