<script lang="ts">
	let { text, disabled = false, type, onclick } = $props();
</script>

<button
	{type}
	{disabled}
	{onclick}
	class={[
		`inline-flex min-h-10 cursor-pointer
	items-center justify-center rounded-sm
	border border-transparent px-4 py-1
	text-base text-sm font-semibold
	select-none
	focus:outline-hidden disabled:pointer-events-none`,
		type === 'submit' &&
			'bg-primary hover:bg-primary/90 disabled:bg-baseAlt1 disabled:text-txtDisabled',
		type === 'button' &&
			'text-txtHint hover:text-txtPrimary hover:bg-baseAlt1/50 bg-transparent disabled:hidden'
	]}
>
	<span>{text}</span>
</button>
