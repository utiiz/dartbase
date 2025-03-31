<script lang="ts">
	import IconArrowDownFill from './icon-arrow-down-fill.svelte';
	import IconArrowUpFill from './icon-arrow-up-fill.svelte';

	let {
		class: klass = '',
		value = $bindable(),
		options = $bindable(),
		onchange = () => {},
		disabledOptions = [],
		icon = null,
		disabled = false
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

<div
	class="{klass} text-txtPrimary
		p-1 transition-colors duration-300 select-none"
	use:clickOutside={() => (open = false)}
>
	<div
		class="{open &&
			'bg-baseAlt2 rounded-b-none'} relative flex size-full h-8.5 cursor-pointer items-center gap-3 rounded-sm px-2 text-sm aria-disabled:cursor-not-allowed"
		aria-disabled={disabled}
	>
		{#if icon}
			{@const Icon = icon}
			<Icon class="text-txtHint size-4.5" />
		{/if}
		<button
			type="button"
			{disabled}
			class="disabled:text-txtDisabled flex flex-1 cursor-pointer items-center justify-between text-left capitalize outline-none disabled:cursor-not-allowed"
			aria-haspopup="listbox"
			onclick={() => (open = !open)}
		>
			<div class="flex-1">
				{typeof value === 'string' ? value : value.name || '??'}
			</div>
			{#if open}
				<IconArrowUpFill class="size-6" />
			{:else}
				<IconArrowDownFill class="size-6" />
			{/if}
		</button>
		{#if open}
			<div
				role="listbox"
				tabindex="0"
				class="bg-base text-txtPrimary border-baseAlt2 absolute top-8.5 left-0 z-10 flex w-full flex-col space-y-1 overflow-auto rounded-b-sm border p-1 shadow-lg focus:outline-none"
			>
				{#each options as option}
					<button
						type="button"
						id="listbox-option-{typeof option === 'string' ? option : option.id}"
						class="hover:bg-baseAlt1 aria-selected:bg-baseAlt1 aria-selected:hover:bg-baseAlt2 aria-selected:text-txtPrimary disabled:text-txtDisabled flex h-8.5 cursor-pointer items-center rounded-sm px-2 capitalize disabled:cursor-not-allowed hover:disabled:bg-transparent"
						role="option"
						disabled={disabledOptions.includes(typeof option === 'string' ? option : option.id)}
						aria-selected={typeof option === 'string' ? option === value : option.id === value.id}
						onclick={() => {
							value = option;
							open = false;
							onchange(option);
						}}
					>
						{typeof option === 'string' ? option : option.name || '??'}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
