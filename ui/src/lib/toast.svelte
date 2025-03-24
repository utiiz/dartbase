<script lang="ts">
	import { fly } from 'svelte/transition';
	import IconAlert from './icon-alert.svelte';
	import IconClose from './icon-close.svelte';

	let { message, show } = $props();
</script>

{#if show}
	<div
		class="fixed bottom-8 z-50 mx-auto flex w-full justify-center px-4"
		transition:fly={{ y: 200, duration: 500 }}
	>
		<span class="bg-dangerAlt mx-4 flex w-md justify-between rounded-sm py-1 shadow-xs sm:mx-7">
			<div class="divide-baseAlt4 flex items-center divide-x px-4">
				<div class="flex items-center pr-3">
					<IconAlert class="text-danger size-4" />
				</div>
				<div class="pl-3 text-sm">{message}</div>
			</div>
			<button class="cursor-pointer p-4" aria-label="Close">
				<IconClose class="text-txtHint size-4" />
			</button>
		</span>
	</div>
{/if}
