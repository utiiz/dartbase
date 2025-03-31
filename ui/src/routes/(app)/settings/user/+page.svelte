<script lang="ts">
	import Accordion from '$lib/accordion.svelte';
	import Breadcrums from '$lib/breadcrums.svelte';
	import Button from '$lib/button.svelte';
	import IconArchiveStack from '$lib/icon-archive-stack.svelte';
	import IconPulse from '$lib/icon-pulse.svelte';
	import IconRoute from '$lib/icon-route.svelte';
	import Input from '$lib/input.svelte';
	import { toastStore } from '$lib/stores/toastStore.js';
	import Toggle from '$lib/toggle.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, message, reset, tainted, isTainted, enhance } = superForm(data.form, {
		onResult: ({ result }) => {
			if (result.type === 'failure' && result.data) {
				toastStore.show(result.data.form.message, 'error', 5000);
			}
			if (result.type === 'success' && result.data) {
				toastStore.show(result.data.form.message, 'success', 5000);
				reset({
					newState: result.data.form.data
				});
			}
		},
		dataType: 'json'
	});

	let expandedAccordion: number | null = $state(null);
	function toggleAccordion(id: number) {
		if (expandedAccordion === id) {
			expandedAccordion = null;
			return;
		}
		expandedAccordion = id;
	}

	const onCancel = () => {
		reset();
	};
</script>

<div class="w-full">
	<Breadcrums path="/settings/user" />
	<form method="POST" action="?/saveSettings" use:enhance>
		<div
			class="bg-base mx-auto flex max-w-[var(--wrapper-width)] flex-col gap-2 rounded-sm px-7.5 py-6 shadow shadow-sm"
		>
			<div class="flex flex-col gap-7">
				<div class="flex flex-1 flex-col gap-7.5 md:flex-row">
					<Input
						label="Email"
						name="email"
						type="text"
						required
						disabled
						bind:value={$form.email}
					/>
					<Input label="Name" name="name" type="text" required bind:value={$form.name} />
				</div>
				<div>
					<Accordion
						icon={IconRoute}
						text="User IP proxy headers"
						onclick={() => toggleAccordion(0)}
						expanded={expandedAccordion === 0}
						bind:enabled={$form.proxy_enabled}
					>
						<Toggle
							name="user_ip_proxy_headers"
							text="Enable"
							hint="(experimental)"
							bind:checked={$form.proxy_enabled}
						/>
						<p class="text-txtHint text-sm">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae tempora modi quibusdam
							itaque molestias autem, eum incidunt maxime molestiae odio ipsam aperiam, officia
							distinctio obcaecati quis quaerat est magnam recusandae.
						</p>
					</Accordion>
				</div>
			</div>
			<div class="mt-7.5 flex justify-end gap-4">
				<Button text="Cancel" type="button" disabled={!isTainted($tainted)} onclick={onCancel} />
				<Button text="Save changes" type="submit" disabled={!isTainted($tainted)} />
			</div>
		</div>
	</form>
</div>
