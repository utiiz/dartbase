<script lang="ts">
	import { slide } from 'svelte/transition';
	import IconArrowUp from './icon-arrow-up.svelte';
	import IconArrowDown from './icon-arrow-down.svelte';

	let { icon, text = '', onclick, enabled = false, expanded = false, children } = $props();
</script>

<div
	aria-expanded={expanded}
	class="group/accordion accordion shadow-shadow border-baseAlt2
	-mt-0.25 flex-1 border
	transition-all duration-300 first:rounded-t-sm last:rounded-b-sm
	has-[+[aria-expanded=true]]:rounded-b-sm aria-expanded:my-4
	aria-expanded:rounded-sm aria-expanded:shadow-sm
	[&[aria-expanded=true]+.accordion]:rounded-t-sm"
>
	<button
		class="group-aria-expanded/accordion:bg-body group-aria-expanded/accordion:hover:bg-body hover:bg-baseAlt1 flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 group-aria-expanded/accordion:rounded-t-sm"
		type="button"
		{onclick}
	>
		<div class="flex items-center gap-3">
			{#if icon}
				{@const Icon = icon}
				<Icon class="text-txtPrimary size-4" />
			{/if}
			<div class="text-txtPrimary text-sm">{text}</div>
		</div>
		<div class="flex items-center gap-3">
			<span
				class="text-txtPrimary bg-baseAlt2 not-aria-disabled:bg-successAlt not-aria-disabled:text-success h-6 rounded-full px-3 py-1 text-xs"
				aria-disabled={!enabled}
			>
				{#if enabled}
					Enabled
				{:else}
					Disabled
				{/if}
			</span>
			{#if expanded}
				<IconArrowUp class="text-txtPrimary size-5" />
			{:else}
				<IconArrowDown class="text-txtPrimary size-5" />
			{/if}
		</div>
	</button>
	{#if expanded}
		<div class="flex flex-col gap-2 rounded-b-sm px-5 py-4" transition:slide={{ duration: 150 }}>
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</div>
