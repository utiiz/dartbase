<script lang="ts">
	let { path = '/' } = $props();
	path = path.replace(/\/$/, '');
	let paths = path.split('/').filter(Boolean);
</script>

<div class="text-txtHint mb-7 flex w-full gap-2">
	{#each paths as p, i (p)}
		{#if i === paths.length - 1}
			<span class="text-txtPrimary capitalize">{p}</span>
		{:else}
			<span class="capitalize">{p}</span>
		{/if}
		{#if i !== paths.length - 1}
			<span class="select-none">/</span>
		{/if}
	{/each}
</div>
