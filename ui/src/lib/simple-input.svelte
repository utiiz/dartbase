<script lang="ts">
	let {
		class: klass = '',
		placeholder,
		name,
		value = $bindable(),
		required = false,
		errors = $bindable(),
		icon = null,
		disabled = false
	} = $props();
</script>

<div
	class="{klass} text-txtPrimary
	p-1 transition-colors duration-300"
>
	<label
		for={name}
		class="focus-within:bg-baseAlt2 flex size-full h-8.5 items-center gap-3 rounded-sm px-2 text-sm"
	>
		{#if icon}
			{@const Icon = icon}
			<Icon class="text-txtHint size-4.5" />
		{/if}
		<input
			type="text"
			id={name}
			{name}
			{disabled}
			{placeholder}
			bind:value
			class="text-txtPrimary disabled:text-txtDisabled block flex-1 outline-none"
			aria-describedby="{name}-error"
		/>
	</label>
</div>
