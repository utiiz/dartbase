<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import IconUser from './icon-user.svelte';
	import SimpleInput from './simple-input.svelte';
	import IconDraggable from './icon-draggable.svelte';
	import SimpleSelect from './simple-select.svelte';
	import { dragHandle } from 'svelte-dnd-action';

	let {
		expanded = false,
		onclick = null,
		name,
		value = $bindable(),
		disabled = false,
		options = null,
		button = null,
		expandable = null,
		children = null
	} = $props();

	let hovered = $state(false);
</script>

<div
	aria-expanded={expanded}
	class="group/setting setting border-baseAlt3 bg-baseAlt1 relative -mt-0.25
		ml-1 flex-1 border outline-none first:rounded-t-sm last:rounded-b-sm
		has-[+[aria-expanded=true]]:rounded-b-sm aria-expanded:my-4
		aria-expanded:rounded-sm
		aria-expanded:shadow-sm [&[aria-expanded=true]+.setting]:rounded-t-sm"
>
	<div onmouseenter={() => (hovered = true)} onmouseleave={() => (hovered = false)} role="group">
		<div class="absolute top-0 -left-6 flex h-10.5 w-6 cursor-grab items-center justify-center">
			{#if hovered}
				<div transition:fly={{ x: 10, duration: 300 }} use:dragHandle>
					<IconDraggable class="text-txtHint size-5" />
				</div>
			{/if}
		</div>
		<div
			class="group-aria-expanded/setting:border-baseAlt3 divide-baseAlt3 flex divide-x-1 group-aria-expanded/setting:border-b-1"
		>
			{#if children}
				{@render children()}
			{/if}
		</div>
		{#if expanded}
			<div
				class="bg-base flex flex-col gap-2 rounded-b-sm px-5 py-4"
				transition:slide={{ duration: 150 }}
			>
				{#if expandable}
					{@render expandable()}
				{/if}
			</div>
		{/if}
	</div>
</div>
