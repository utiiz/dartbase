<script lang="ts">
	import '../../app.css';
	import IconDatabase from '$lib/icon-database.svelte';
	import IconSettings from '$lib/icon-settings.svelte';
	import IconChart from '$lib/icon-chart.svelte';
	import Logo from '$lib/logo.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();
	let initials =
		data.user?.name
			?.split(' ')
			.map((name: string) => name[0])
			.join('') ?? '??';
</script>

<div class="flex h-full">
	<aside
		class="bg-base border-baseAlt2 flex h-full w-[var(--app-sidebar-width)] flex-col justify-between border-r py-5"
	>
		<div class="flex flex-col items-center gap-9">
			<a href="/" aria-label="Home">
				<Logo />
			</a>
			<nav class="flex flex-col gap-6">
				<a
					href="/games"
					aria-current={page.url.pathname === '/games' || page.url.pathname === '/'}
					class="ring-tooltip hover:not-aria-current:bg-baseAlt1 border-tooltip mx-auto flex size-10 items-center justify-center rounded-lg transition-all duration-300 aria-current:bg-none aria-current:ring-2"
					aria-label="Games"><IconDatabase class="size-6" /></a
				>
				<a
					href="/stats"
					aria-current={page.url.pathname === '/stats'}
					class="ring-tooltip hover:not-aria-current:bg-baseAlt1 border-tooltip mx-auto flex size-10 items-center justify-center rounded-lg transition-all duration-300 aria-current:bg-none aria-current:ring-2"
					aria-label="Stats"><IconChart class="size-6" /></a
				>
				<a
					href="/settings"
					aria-current={page.url.pathname === '/settings'}
					class="ring-tooltip hover:not-aria-current:bg-baseAlt1 border-tooltip mx-auto flex size-10 items-center justify-center rounded-lg transition-all duration-300 aria-current:bg-none aria-current:ring-2"
					aria-label="Settings"><IconSettings class="size-6" /></a
				>
			</nav>
		</div>

		<a href="/logout">
			<div
				class="bg-baseAlt2 text-txtHint hover:text-txtPrimary mx-auto flex size-10 cursor-pointer items-center justify-center rounded-full text-[12px] font-semibold"
			>
				{initials}
			</div>
		</a>
	</aside>
	<div class="bg-body flex-1">
		{@render children()}
	</div>
</div>
