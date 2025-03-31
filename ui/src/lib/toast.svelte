<script lang="ts">
	import { toastStore, type ToastType } from '$lib/stores/toastStore';
	import { fly } from 'svelte/transition';
	import IconAlert from './icon-alert.svelte';
	import IconClose from './icon-close.svelte';
	import { type Component } from 'svelte';
	import IconCheckboxCircle from './icon-checkbox-circle.svelte';
	import IconInformation from './icon-information.svelte';

	const typeStyles: Record<ToastType, string> = {
		success: 'bg-successAlt',
		error: 'bg-dangerAlt',
		warning: 'bg-warningAlt',
		info: 'bg-infoAlt'
	};

	const typeIcons: Record<ToastType, Component> = {
		success: IconCheckboxCircle,
		error: IconAlert,
		warning: IconAlert,
		info: IconInformation
	};

	const typeIconColors: Record<ToastType, string> = {
		success: 'text-success',
		error: 'text-danger',
		warning: 'text-warning',
		info: 'text-info'
	};
</script>

{#if $toastStore.current}
	<div
		class="fixed bottom-8 z-50 flex w-full justify-center"
		in:fly={{ y: 200, duration: 500 }}
		out:fly={{ opacity: 0, duration: 200 }}
	>
		<span
			class="{typeStyles[
				$toastStore.current.type
			]} mx-4 flex w-md justify-between rounded-sm py-1 shadow-xs sm:mx-7"
		>
			<div class="divide-txtHint flex items-center divide-x px-4">
				<div class="flex items-center pr-3">
					{#if typeIcons[$toastStore.current.type]}
						{@const Icon = typeIcons[$toastStore.current.type]}
						<Icon class="{typeIconColors[$toastStore.current.type]} size-4" />
					{/if}
				</div>
				<div class="text-txtPrimary pl-3 text-sm">{$toastStore.current.message}</div>
			</div>
			<button class="cursor-pointer p-4" aria-label="Close" on:click={() => toastStore.remove()}>
				<IconClose class="text-txtHint size-4" />
			</button>
		</span>
	</div>
{/if}
