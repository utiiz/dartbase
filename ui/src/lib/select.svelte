<script lang="ts">
	import IconArrowDownFill from './icon-arrow-down-fill.svelte';
	import IconArrowUpFill from './icon-arrow-up-fill.svelte';

	let {
		label,
		current = $bindable(),
		required = false,
		options = $bindable(),
		disabled = false,
		errors = $bindable()
	} = $props();

	let open = $state(false);

	function clickOutside(node: HTMLElement, callback?: () => void) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node)) {
				callback?.();
				node.dispatchEvent(new CustomEvent('click-outside'));
			}
		};
		document.addEventListener('mousedown', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('mousedown', handleClick, true);
			}
		};
	}
</script>

<div class="relative flex flex-1" use:clickOutside={() => (open = false)}>
	<button
		class="{open && 'bg-baseAlt2 rounded-b-none'} bg-baseAlt1 text-txtHint flex
		flex-1 cursor-pointer flex-col items-start
		rounded-sm py-2 text-xs font-semibold transition-colors
		duration-300 select-none aria-disabled:cursor-not-allowed"
		type="button"
		{disabled}
		onclick={() => (open = !open)}
	>
		<div class="px-4">
			{label}
			{#if required}
				<span class="text-danger">*</span>
			{/if}
		</div>
		<div
			class="text-txtPrimary flex size-full h-8.5 items-center gap-3 rounded-sm px-4 text-sm font-normal"
			aria-disabled={disabled}
		>
			<div
				class="disabled:text-txtDisabled flex flex-1 cursor-pointer items-center justify-between text-left capitalize outline-none disabled:cursor-not-allowed"
				aria-haspopup="listbox"
			>
				<div>
					{current.name}
				</div>

				{#if open}
					<IconArrowUpFill class="size-6" />
				{:else}
					<IconArrowDownFill class="size-6" />
				{/if}
			</div>
		</div>
	</button>
	{#if open}
		<div
			role="listbox"
			tabindex="0"
			class="bg-base text-txtPrimary border-baseAlt2 absolute top-16.5 left-0 z-10 flex w-full flex-col space-y-1 overflow-auto rounded-b-sm border p-1 shadow-lg focus:outline-none"
		>
			{#each options as option}
				<button
					type="button"
					id="listbox-option-{option.id}"
					class="hover:bg-baseAlt1 aria-selected:bg-baseAlt1 aria-selected:hover:bg-baseAlt2 aria-selected:text-txtPrimary flex h-8.5 cursor-pointer items-center rounded-sm px-2 capitalize"
					role="option"
					aria-selected={option.id === current.id}
					onclick={() => {
						current = option;
						open = false;
					}}
				>
					{option.name}
				</button>
			{/each}
		</div>
	{/if}
</div>
