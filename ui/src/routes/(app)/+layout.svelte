<script lang="ts">
	import '../../app.css';
	import IconDatabase from '$lib/icon-database.svelte';
	import IconSettings from '$lib/icon-settings.svelte';
	import IconChart from '$lib/icon-chart.svelte';
	import Logo from '$lib/logo.svelte';
	import Toast from '$lib/toast.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();

	let initials = $derived(
		(data.user?.name ?? '')
			.split(' ')
			.map((name: string) => name[0] ?? '')
			.join('') || '??'
	);
</script>

<div class="flex h-full overflow-hidden">
	<aside
		class="bg-base border-baseAlt2 flex h-full min-w-[var(--app-sidebar-width)] flex-col justify-between border-r py-5"
	>
		<div class="flex flex-col items-center gap-9">
			<a href="/" aria-label="Home">
				<Logo class="size-10 fill-none" />
			</a>
			<nav class="flex flex-col gap-6">
				<a
					href="/games"
					aria-current={page.url.pathname === '/games' || page.url.pathname === '/'}
					class="ring-tooltip hover:not-aria-current:bg-baseAlt1 border-tooltip mx-auto flex size-10 items-center justify-center rounded-lg transition-all duration-300 aria-current:bg-none aria-current:ring-2"
					aria-label="Games"><IconDatabase class="text-txtPrimary size-6" /></a
				>
				<a
					href="/stats"
					aria-current={page.url.pathname === '/stats'}
					class="ring-tooltip hover:not-aria-current:bg-baseAlt1 border-tooltip mx-auto flex size-10 items-center justify-center rounded-lg transition-all duration-300 aria-current:bg-none aria-current:ring-2"
					aria-label="Stats"><IconChart class="text-txtPrimary size-6" /></a
				>
				<a
					href="/settings"
					aria-current={page.url.pathname.startsWith('/settings')}
					class="ring-tooltip hover:not-aria-current:bg-baseAlt1 border-tooltip mx-auto flex size-10 items-center justify-center rounded-lg transition-all duration-300 aria-current:bg-none aria-current:ring-2"
					aria-label="Settings"><IconSettings class="text-txtPrimary size-6" /></a
				>
			</nav>
		</div>

		<a href="/logout">
			{#if data.user?.avatar}
				<div
					class="mx-auto flex size-11 cursor-pointer items-center justify-center rounded-full text-[12px] font-semibold"
				>
					<img
						src={`http://127.0.0.1:8090/api/files/_pb_users_auth_/${data.user.id}/${data.user.avatar}`}
						alt="Avatar"
					/>
				</div>
			{:else}
				<div
					class="bg-baseAlt2 text-txtHint hover:text-txtPrimary mx-auto flex size-10 cursor-pointer items-center justify-center rounded-full text-[12px] font-semibold uppercase"
				>
					{initials}
				</div>
			{/if}
		</a>
	</aside>
	<div class="bg-body flex-1">
		{@render children()}
		<Toast />
	</div>
</div>
