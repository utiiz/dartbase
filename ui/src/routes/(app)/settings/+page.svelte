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
	<Breadcrums path="/settings/application" />
	<form method="POST" action="?/saveSettings" use:enhance>
		<div
			class="bg-base mx-auto flex max-w-[var(--wrapper-width)] flex-col gap-2 rounded-sm px-7.5 py-6 shadow"
		>
			<div class="flex flex-col gap-7">
				<div class="flex flex-1 flex-col gap-7.5 md:flex-row">
					<Input
						label="Application name"
						name="application_name"
						type="text"
						required
						disabled
						value="DartBase"
					/>
					<Input
						label="Dartboard UUID"
						name="dartboard"
						type="text"
						required
						bind:value={$form.dartboard}
					/>
				</div>
				<div>
					<Accordion
						icon={IconRoute}
						text="User IP proxy headers"
						onclick={() => toggleAccordion(0)}
						expanded={expandedAccordion === 0}
					>
						<div
							class="bg-infoAlt text-txtPrimary flex flex-col gap-0.5 rounded-sm px-4 py-3 text-sm"
						>
							<span>Resolved user IP: <span class="font-semibold">127.0.0.1</span></span>
							<span>Detected proxy header: <span class="font-semibold">N/A</span></span>
						</div>
						<div class="text-txtHint mt-3 flex flex-col gap-2.5 text-sm/6">
							<div>
								When PocketBase is deployed on platforms like Fly or it is accessible through
								proxies such as NGINX, requests from different users will originate from the same IP
								address (the IP of the proxy connecting to your PocketBase app).
							</div>
							<div>
								In this case to retrieve the actual user IP (used for rate limiting, logging, etc.)
								you need to properly configure your proxy and list below the trusted headers that
								PocketBase could use to extract the user IP.
							</div>
							<div class="font-semibold">
								When using such proxy, to avoid spoofing it is recommended to:
								<ul class="list-disc pl-8">
									<li>
										use headers that are controlled only by the proxy and cannot be manually set by
										the users
									</li>
									<li>
										make sure that the PocketBase server can be accessed only through the proxy
									</li>
								</ul>
							</div>
							<div>
								You can clear the headers field if PocketBase is not deployed behind a proxy.
							</div>
						</div>
					</Accordion>
					<Accordion
						icon={IconPulse}
						text="Rate limits"
						onclick={() => toggleAccordion(1)}
						expanded={expandedAccordion === 1}
						bind:enabled={$form.rate_limiting}
					>
						<Toggle
							name="user_ip_proxy_headers"
							text="Enable"
							hint="(experimental)"
							bind:checked={$form.rate_limiting}
						/>
						<p class="text-txtHint text-sm">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium pariatur fuga
							odit iusto libero dicta porro architecto nisi ab adipisci! Deserunt voluptatibus
							repudiandae similique dolorem accusantium minima quia ipsum ipsam!
						</p>
					</Accordion>
					<Accordion
						icon={IconArchiveStack}
						text="Batch API"
						onclick={() => toggleAccordion(2)}
						expanded={expandedAccordion === 2}
					>
						<div class="flex gap-7.5">
							<Input label="Max allowed batch requests" name="max_allowed" type="text" required />
							<Input
								label="Max processing time (in seconds)"
								name="max_processing_time"
								type="text"
								required
							/>
							<Input label="Max body size (in bytes)" name="max_body_size" type="text" required />
						</div>
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
