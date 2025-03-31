<script lang="ts">
	let { name, checked = $bindable(), text = '', hint = undefined } = $props();
</script>

<div>
	<label for="input-toggle-{name}" class="inline-flex">
		<input
			type="checkbox"
			id="input-toggle-{name}"
			name="input-toggle-{name}"
			bind:checked
			class="peer hidden"
		/>
		<div
			class="before:bg-baseAlt1 hover:before:bg-baseAlt4 peer-checked:hover:before:bg-success peer-checked:before:bg-success
			after:bg-body text-txtPrimary
			relative my-2 flex w-auto grow-0 cursor-pointer
			items-center text-sm select-none
			before:mr-3 before:block before:h-6 before:w-10
			before:rounded-full before:shadow-xs before:transition-all before:duration-300
			after:absolute after:left-1 after:size-4 after:origin-center after:rounded-full
			after:shadow-sm after:transition-all after:duration-75
			after:ease-[cubic-bezier(.61,.17,.93,.41)] peer-checked:after:left-5 peer-active:after:scale-85"
		>
			{text}
			{#if hint}
				<div class="text-txtHint ml-1 text-xs">{hint}</div>
			{/if}
		</div>
	</label>
</div>
