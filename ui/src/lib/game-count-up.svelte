<script lang="ts">
	import IconFullscreen from '$lib/icon-fullscreen.svelte';
	import { createWebsocketStore } from '$lib/stores/websocket';
	import * as MessageType from '$lib/models/message';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Dartboard from '$lib/dartboard.svelte';

	let { data } = $props();

	let game = $state(data.game);
	let player = $state(game.players[0]);

	let score = $derived(
		player?.visits.reduce((t: number, n: { darts: { score: number }[] }) => {
			return t + (n.darts?.reduce((t: number, n: { score: number }) => t + n.score, 0) || 0);
		}, 0) || 0
	);

	let removing_darts = $state(false);
	let number_of_darts = $derived(
		player?.visits.reduce(
			(t: number, n: { darts: { score: number }[] }) => t + n.darts?.length,
			0
		) || 0
	);
	let average = $derived(Math.round((score / number_of_darts) * 3 * 100) / 100 || 0);

	onMount(() => {
		const ws = createWebsocketStore();
		ws.onopen(() => {
			ws.send({
				type: MessageType.START_GAME,
				data: {
					uuid: data.user?.settings.dartboard,
					game_id: data.game_id
				}
			});
		});
		ws.onmessage((event) => {
			const message = JSON.parse(event.data);
			if (message.type === MessageType.DART_THROWN) {
				player.visits[player.visits.length - 1].darts.push({
					x: message.data.coordinates[0],
					y: message.data.coordinates[1],
					score: message.data.score,
					bed: message.data.bed,
					segment: message.data.segment
				});
			}
			if (message.type === MessageType.DARTS_REMOVED) {
				removing_darts = true;
				setTimeout(() => {
					removing_darts = false;
				}, 2500);
				setTimeout(() => {
					if (player.visits.length === 10) {
						player.visits = [];
					}
					player.visits.push({
						darts: []
					});
				}, 1000);
			}
		});
	});
</script>

<div
	class="bg-base relative mx-auto flex max-w-[var(--wrapper-width)] flex-col gap-2 rounded-sm px-7.5 py-6 shadow"
>
	<div class="flex flex-col items-center justify-center gap-8">
		<div class="text-txtHint mt-3 flex flex-col gap-2.5 text-center text-sm/6">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, rem! Eaque, placeat tempore illum
			iure nihil voluptatibus error vel repellat amet quae! Soluta voluptate incidunt obcaecati
			velit, eveniet labore rerum?
		</div>
		<div class="text-txtPrimary text-8xl font-semibold">{score}</div>
		<div class="grid grid-cols-5 gap-6">
			{#each player.visits as visit, idx (idx)}
				<div class="flex flex-col items-center gap-2">
					<span class="text-txtPrimary text-3xl font-semibold"
						>{visit.darts.reduce((t, n) => t + n.score, 0)}</span
					>
					<span class="text-txtHint text-sm">Round {idx + 1}</span>
				</div>
			{/each}
			{#each Array(10 - Math.min(player.visits.length, 10)) as _, idx (idx)}
				<div class="flex flex-col items-center gap-2">
					<span class="text-txtDisabled text-3xl font-semibold">0</span>
					<span class="text-txtDisabled text-sm">Round {idx + 1 + player.visits.length}</span>
				</div>
			{/each}
		</div>
		<div class="relative mt-5 grid grid-cols-3 gap-3">
			{#if removing_darts}
				<div
					in:fly={{ x: -20, duration: 300 }}
					out:fly={{ x: 20, duration: 300 }}
					class="bg-warning absolute -top-11 left-1/2 -translate-x-1/2 rounded-sm px-5 py-2 text-sm font-semibold text-white"
				>
					Removing darts...
				</div>
			{/if}
			{#each player.visits[player.visits.length - 1].darts as dart, idx (idx)}
				<div in:fly={{ y: -20, duration: 200 }}>
					{#if dart.bed === 'MISS'}
						<div
							class="bg-success flex aspect-[3/2] h-20 flex-col items-center justify-center rounded-sm p-2 py-3"
						>
							<span class="text-xl font-semibold text-white">MISS</span>
						</div>
					{:else}
						<div
							class="bg-success flex aspect-[3/2] h-20 flex-col items-center rounded-sm p-2 py-3"
						>
							<span class="text-3xl font-semibold text-white">{dart.score}</span>
							<span class="text-sm text-white">{dart.bed}{dart.segment}</span>
						</div>
					{/if}
				</div>
			{/each}
			{#each Array(3 - Math.min(player.visits[player.visits.length - 1].darts.length, 3)) as _, idx (idx)}
				<div
					class="bg-baseAlt2 flex aspect-[3/2] h-20 flex-col items-center justify-center rounded-sm p-2 py-3"
				>
					<!-- <span class="text-txtHint text-3xl font-semibold">D16</span> -->
				</div>
			{/each}
			{#each player.visits[player.visits.length - 1].darts as dart, idx (idx)}
				<div
					class="bg-baseAlt2 bg-position-[center_top_1rem] relative flex aspect-[3/4]
						w-30 flex-col items-center justify-center overflow-hidden rounded-sm"
				>
					<Dartboard dartX={dart.x} dartY={dart.y} zoomLevel={1.5} />
				</div>
			{/each}
			{#each Array(3 - Math.min(player.visits[player.visits.length - 1].darts.length, 3)) as _, idx (idx)}
				<div
					class="bg-baseAlt2 bg-position-[center_top_1rem] relative flex aspect-[3/4]
						w-30 flex-col items-center justify-center overflow-hidden rounded-sm"
				></div>
			{/each}
		</div>
		<div class="text-txtPrimary">
			Average: <span class="font-semibold">{average}</span>
		</div>
		<div class="text-txtPrimary absolute right-5 bottom-5">
			<IconFullscreen class="text-txtHint size-5" />
		</div>
	</div>
</div>
