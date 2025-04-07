<script lang="ts">
	import { createWebsocketStore } from '$lib/stores/websocket';
	import * as MessageType from '$lib/models/message';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Dartboard from '$lib/dartboard.svelte';

	let { data } = $props();

	let game = $state(data.game);

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
			const idx = game.players.findIndex((p) => p.current);
			let player = game.players[idx];
			if (message.type === MessageType.DART_THROWN) {
				let shouldAddDart = true;
				if (
					player.visits[player.visits.length - 1].darts[
						player.visits[player.visits.length - 1].darts.length - 1
					]?.bust
				) {
					shouldAddDart = false;
				}
				if (shouldAddDart) {
					let bust = false;
					if (
						player.score - message.data.score < 0 ||
						(player.score - message.data.score === 0 && message.data.bed != 'D')
					) {
						bust = true;
					}
					player.visits[player.visits.length - 1].darts.push({
						x: message.data.coordinates[0],
						y: message.data.coordinates[1],
						score: !bust ? message.data.score : 0,
						bed: message.data.bed,
						segment: message.data.segment,
						bust
					});
				}

				let score =
					player?.visits.reduce((t: number, n: { darts: { score: number; bust: boolean }[] }) => {
						const hasBusts = n.darts.some((d) => d.bust);
						if (hasBusts) {
							return t;
						}
						return t + (n.darts?.reduce((t: number, n: { score: number }) => t - n.score, 0) || 0);
					}, game.type.settings.starts_on) || game.type.settings.starts_on;

				player.score = score;
			}
			if (message.type === MessageType.DARTS_REMOVED) {
				player.removing_darts = true;
				setTimeout(() => {
					player.removing_darts = false;
				}, 2500);
				setTimeout(() => {
					player.current = false;
					// complete with 'MISS' if the number of dart is less than 3 and there is no bust
					if (!player.visits[player.visits.length - 1].darts.some((d) => d.bust)) {
						for (let i = player.visits[player.visits.length - 1].darts.length; i < 3; i++) {
							player.visits[player.visits.length - 1].darts.push({
								x: 0,
								y: 0,
								score: 0,
								bed: 'MISS',
								segment: '',
								bust: false
							});
						}
					}
					game.players[(idx + 1) % game.players.length].visits.push({
						darts: []
					});
					game.players[(idx + 1) % game.players.length].current = true;
				}, 1000);
			}
		});
	});
</script>

<div class="mx-auto flex max-w-[var(--wrapper-width)] gap-3 rounded-sm">
	{#each game.players as player, idx (idx)}
		{@const number_of_darts_nine =
			player.visits.slice(0, 3).reduce((t, n: { darts: { score: number }[] }) => {
				return t + n.darts?.length;
			}, 0) || 0}
		{@const first_nine =
			player.visits.slice(0, 3).reduce((t, n: { darts: { score: number; bust: boolean }[] }) => {
				const hasBusts = n.darts.some((d) => d.bust);
				if (hasBusts) {
					return t;
				}
				return t + n.darts.reduce((t, n) => t + n.score, 0);
			}, 0) || 0}
		{@const first_nine_average =
			Math.round((first_nine / number_of_darts_nine) * 3 * 100) / 100 || 0}
		{@const number_of_darts =
			player.visits.reduce((t, n: { darts: { score: number }[] }) => {
				return t + n.darts?.length;
			}, 0) || 0}
		{@const average =
			Math.round(((game.type.settings.starts_on - player.score) / number_of_darts) * 3 * 100) /
				100 || 0}
		<div
			class="bg-base relative flex w-full flex-col gap-2 rounded-sm px-7.5 py-6 shadow transition-opacity duration-300 not-aria-current:opacity-25"
			aria-current={player.current}
		>
			<div class="flex flex-col items-center justify-center gap-8">
				<div class="text-txtPrimary mt-3 flex flex-col gap-2.5 text-center text-xl">
					{player.name}
				</div>
				<div class="text-txtPrimary text-8xl font-semibold">{player.score}</div>
				<div class="relative mt-5 grid grid-cols-3 gap-3">
					{#if player.removing_darts}
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
							{:else if dart.bust}
								<div
									class="bg-danger flex aspect-[3/2] h-20 flex-col items-center justify-center rounded-sm p-2 py-3"
								>
									<span class="text-xl font-semibold text-white">BUST</span>
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
							{#if dart.bed === 'MISS'}
								<div
									class="bg-baseAlt2 absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center rounded-sm"
								>
									<span class="text-txtHint text-3xl font-semibold">{dart.bed}</span>
								</div>
							{:else}
								<Dartboard dartX={dart.x} dartY={dart.y} zoomLevel={1.5} />
							{/if}
						</div>
					{/each}
					{#each Array(3 - Math.min(player.visits[player.visits.length - 1].darts.length, 3)) as _, idx (idx)}
						<div
							class="bg-baseAlt2 bg-position-[center_top_1rem] relative flex aspect-[3/4]
						w-30 flex-col items-center justify-center overflow-hidden rounded-sm"
						></div>
					{/each}
				</div>
				<div class="text-txtPrimary flex w-full justify-between px-10 text-sm">
					<div class="flex flex-col items-center">
						<span class="text-txtHint">Average</span>
						<span class="text-3xl font-semibold">{average}</span>
					</div>
					<div class="bg-txtDisabled w-[1px]"></div>
					<div class="flex flex-col items-center">
						<span class="text-txtHint">First-9 Avg.</span>
						<span class="text-3xl font-semibold">{first_nine_average}</span>
					</div>
					<div class="bg-txtDisabled w-[1px]"></div>
					<div class="flex flex-col items-center">
						<span class="text-txtHint">Checkout</span>
						<span class="text-3xl font-semibold">- %</span>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
