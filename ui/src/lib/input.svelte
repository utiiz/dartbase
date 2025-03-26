<script lang="ts">
	let { label, name, type, value = $bindable(), required = false, errors = $bindable() } = $props();
</script>

<div
	class="bg-baseAlt1 focus:bg-baseAlt2 focus-within:bg-baseAlt2 group flex-1 rounded-sm px-4 py-2 transition-colors duration-300"
>
	<label
		for={name}
		class="text-txtHint group-focus-within:text-txtPrimary block text-sm font-semibold"
	>
		{label}
		{#if required}
			<span class="text-danger">*</span>
		{/if}
	</label>
	<input
		{type}
		{name}
		bind:value
		class="text-txtPrimary block h-7 w-full text-sm outline-none"
		aria-describedby="email-error"
	/>
</div>
