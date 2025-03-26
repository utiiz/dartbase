<script lang="ts">
	import Breadcrums from '$lib/breadcrums.svelte';
	import Button from '$lib/button.svelte';
	import Input from '$lib/input.svelte';

	let { data } = $props();

	// Initial values from the data prop
	const initialApplicationName = 'DartBase';
	const initialDartboardUuid = data.user?.settings?.dartboard || '';

	// Use $state for form fields
	let application_name = $state(initialApplicationName);
	let dartboard_uuid = $state(initialDartboardUuid);

	// Derive a state to check if form has been modified
	let hasChanged = $derived(
		application_name !== initialApplicationName || dartboard_uuid !== initialDartboardUuid
	);

	const onCancel = () => {
		application_name = initialApplicationName;
		dartboard_uuid = initialDartboardUuid;
	};
</script>

<div class="w-full">
	<Breadcrums path="/settings/application" />
	<form method="POST" action="?/settings">
		<div class="bg-base mx-auto flex w-[var(--wrapper-width)] flex-col rounded-sm px-7.5 py-6">
			<div class="flex flex-1 gap-2">
				<Input
					label="Application name"
					name="application_name"
					type="text"
					required
					bind:value={application_name}
				/>
				<Input
					label="Dartboard UUID"
					name="dartboard"
					type="text"
					required
					bind:value={dartboard_uuid}
				/>
			</div>
			<div class="mt-7.5 flex justify-end gap-4">
				<Button text="Cancel" type="button" disabled={!hasChanged} onclick={onCancel} />
				<Button text="Save changes" type="submit" disabled={!hasChanged} onclick={onCancel} />
			</div>
		</div>
	</form>
</div>
