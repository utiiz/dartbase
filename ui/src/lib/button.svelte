<script lang="ts">
	let {
		text,
		disabled = false,
		hide_when_disabled = false,
		type,
		left_icon = null,
		right_icon = null,
		onclick = undefined
	} = $props();
</script>

<button
	{type}
	{disabled}
	{...onclick ? { onclick } : {}}
	class={[
		`inline-flex min-h-10 cursor-pointer
		items-center justify-center gap-1
		rounded-sm border border-transparent px-4
		py-1 text-base text-sm font-semibold select-none
		focus:outline-hidden disabled:pointer-events-none`,
		type === 'submit' &&
			'bg-primary hover:bg-primary/90 disabled:bg-baseAlt1 disabled:text-txtDisabled',
		type === 'button' &&
			'text-txtHint hover:text-txtPrimary hover:bg-baseAlt1/50 disabled:text-txtDisabled bg-transparent',
		hide_when_disabled && 'disabled:hidden'
	]}
>
	{#if left_icon}
		{@const Icon = left_icon}
		<Icon class="size-5" />
	{/if}
	<span>{text}</span>
	{#if right_icon}
		{@const Icon = right_icon}
		<Icon class="size-5" />
	{/if}
</button>
