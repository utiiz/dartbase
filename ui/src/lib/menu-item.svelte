<script lang="ts">
	let { class: klass = '', label = '', link = '/', selected = false, icon } = $props();
</script>

<a
	href={link}
	class="group hover:bg-baseAlt1 hover:text-txtPrimary flex cursor-pointer items-center gap-3 rounded-sm px-2 py-2 transition-colors duration-300 select-none
	{selected ? 'bg-baseAlt1 text-txtPrimary' : 'text-txtHint'} {klass}"
>
	{#if icon}
		{@const Icon = icon}
		<Icon class="size-4.5" />
	{/if}
	<div class="text-sm">
		{label}
	</div>
</a>
