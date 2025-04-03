<script lang="ts">
	import Breadcrums from '$lib/breadcrums.svelte';
	import IconFullscreen from '$lib/icon-fullscreen.svelte';
	import { createWebsocketStore } from '$lib/stores/websocket';
	import * as MessageType from '$lib/models/message';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let { data } = $props();

	let game = $state(data.game);
	let score = $derived(
		game?.visits.reduce((t, n) => {
			return t + (n.darts?.reduce((t, n) => t + n.score, 0) || 0);
		}, 0) || 0
	);
	let number_of_darts = $derived(game?.visits.reduce((t, n) => t + n.darts?.length, 0) || 0);
	let average = $derived(Math.round((score / number_of_darts) * 3 * 100) / 100);

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
			console.log(message);
			if (message.type === MessageType.DART_THROWN) {
				game.visits[game.visits.length - 1].darts.push({
					x: message.data.x,
					y: message.data.y,
					score: message.data.score,
					bed: message.data.bed,
					segment: message.data.segment
				});
			}
			if (message.type === MessageType.DARTS_REMOVED) {
				if (game.visits.length === 10) {
					game.visits = [];
				}
				game.visits.push({
					darts: []
				});
			}
		});
	});
</script>

<div class="size-full p-7">
	<Breadcrums path="/game/count-up" />
	<div
		class="bg-base relative mx-auto flex max-w-[var(--wrapper-width)] flex-col gap-2 rounded-sm px-7.5 py-6 shadow"
	>
		<div class="flex flex-col items-center justify-center gap-8">
			<div class="text-txtHint mt-3 flex flex-col gap-2.5 text-center text-sm/6">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, rem! Eaque, placeat tempore
				illum iure nihil voluptatibus error vel repellat amet quae! Soluta voluptate incidunt
				obcaecati velit, eveniet labore rerum?
			</div>
			<div class="text-txtPrimary text-8xl font-semibold">{score}</div>
			<div class="grid grid-cols-5 gap-6">
				{#each game.visits as visit, idx (idx)}
					<div class="flex flex-col items-center gap-2">
						<span class="text-txtPrimary text-3xl font-semibold"
							>{visit.darts.reduce((t, n) => t + n.score, 0)}</span
						>
						<span class="text-txtHint text-sm">Round {idx + 1}</span>
					</div>
				{/each}
				{#each Array(10 - Math.min(game.visits.length, 10)) as _, idx (idx)}
					<div class="flex flex-col items-center gap-2">
						<span class="text-txtDisabled text-3xl font-semibold">0</span>
						<span class="text-txtDisabled text-sm">Round {idx + 1 + game.visits.length}</span>
					</div>
				{/each}
			</div>
			<div class="mt-5 grid grid-cols-3 gap-3">
				{#each game.visits[game.visits.length - 1].darts as dart, idx (idx)}
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
				{#each Array(3 - Math.min(game.visits[game.visits.length - 1].darts.length, 3)) as _, idx (idx)}
					<div
						class="bg-baseAlt2 flex aspect-[3/2] h-20 flex-col items-center justify-center rounded-sm p-2 py-3"
					>
						<!-- <span class="text-txtHint text-3xl font-semibold">D16</span> -->
					</div>
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
</div>
