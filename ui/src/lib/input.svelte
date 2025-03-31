<script lang="ts">
	let {
		label,
		name,
		type,
		value = $bindable(),
		required = false,
		errors = $bindable(),
		disabled = false
	} = $props();
</script>

<div
	class="bg-baseAlt1 focus:bg-baseAlt2
	focus-within:bg-baseAlt2 text-txtHint
	focus-within:text-txtPrimary flex-1
	rounded-sm px-4 py-2 transition-colors duration-300"
>
	<label for={name} class="block text-xs font-semibold">
		{label}
		{#if required}
			<span class="text-danger">*</span>
		{/if}
	</label>
	<input
		{type}
		{name}
		{disabled}
		bind:value
		class="text-txtPrimary disabled:text-txtDisabled block h-7 w-full text-sm outline-none"
		aria-describedby="{name}-error"
	/>
</div>
