<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import IconArrowRight from '$lib/icon-arrow-right.svelte';
	import Input from '$lib/input.svelte';
	import Logo from '$lib/logo.svelte';
	import Toast from '$lib/toast.svelte';

	let { data } = $props();
	let show = $state(false);

	function showToast() {
		show = true;
		setTimeout(() => {
			show = false;
		}, 5000);
	}

	const { form, errors, message, enhance } = superForm(data.form, {
		onResult: ({ result }) => {
			if (result.type === 'failure') {
				showToast();
			}
		}
	});
</script>

<div class="relative size-full">
	<div class="flex size-full items-center justify-center">
		<div class="mx-auto w-md">
			<div class="flex flex-col gap-12">
				<div class="flex justify-center gap-2">
					<Logo class="size-10 fill-none" />
					<span class="text-txtPrimary text-2xl">Dart<strong>Base</strong></span>
				</div>

				<div>
					<div class="text-center">
						<p class=" text-primary text-lg">Sign Up</p>
						<p class="mt-2 text-sm text-gray-600">
							Already have an account ?
							<a class="text-info font-medium" href="/login"> Login here </a>
						</p>
					</div>
					<div class="mt-5">
						<!-- Form -->
						<form method="POST" action="?/signup" novalidate use:enhance>
							<div class="grid gap-y-6">
								<Input
									label="Email"
									name="email"
									type="email"
									required
									bind:errors={$errors.email}
									bind:value={$form.email}
								/>
								<div class="mb-2 space-y-2">
									<Input
										label="Password"
										name="password"
										type="password"
										required
										bind:errors={$errors.password}
										bind:value={$form.password}
									/>

									<div class="text-txtHint text-xs">Recommended at least 10 characters</div>
								</div>

								<Input
									label="Confirm password"
									name="passwordConfirm"
									type="password"
									required
									bind:errors={$errors.passwordConfirm}
									bind:value={$form.passwordConfirm}
								/>

								<button
									type="submit"
									class="group bg-primary hover:bg-primary/90 text-body inline-flex h-14 w-full cursor-pointer items-center justify-center gap-x-2 rounded-sm border border-transparent px-4 py-3 text-sm font-semibold focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
								>
									<span>Sign up</span>
									<IconArrowRight
										class="size-5 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5"
									/>
								</button>
							</div>
						</form>
						<!-- End Form -->
					</div>
				</div>
			</div>
		</div>
	</div>
	<Toast {show} message={$message} />
</div>
