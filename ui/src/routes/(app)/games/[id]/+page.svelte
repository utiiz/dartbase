<script lang="ts">
	import Breadcrums from '$lib/breadcrums.svelte';
	import GameCountUp from '$lib/game-count-up.svelte';
	import GameStandard from '$lib/game-standard.svelte';

	let { data } = $props();
	let type = data.game.type;
</script>

<div class="size-full">
	<Breadcrums path="/game/{type.name}" />
	{#if type.name === 'X01'}
		<GameStandard {data} />
	{/if}
	{#if type.name === 'Count up'}
		<GameCountUp {data} />
	{/if}
</div>
