<script lang="ts">
	import MenuItem from '$lib/menu-item.svelte';
	import IconUser from '$lib/icon-user.svelte';
	import IconPlus from '$lib/icon-plus.svelte';
	import IconWorld from '$lib/icon-world.svelte';
	import IconHome from '$lib/icon-home.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();
</script>

<div class="flex h-full">
	<aside
		class="bg-base border-baseAlt2 flex h-full w-[var(--page-sidebar-width)] flex-col justify-between border-r px-3 py-5"
	>
		<div class="flex flex-col gap-9">
			<div class="space-y-3">
				<!-- Title -->
				<div class="text-txtHint ml-1 text-sm font-semibold">Play</div>
				<MenuItem
					icon={IconHome}
					label="Local game"
					link="/games"
					selected={page.url.pathname === '/games' || page.url.pathname === '/games/local'}
				/>
				<MenuItem
					icon={IconWorld}
					label="Online game"
					link="/games"
					selected={page.url.pathname === '/settings/user'}
				/>
			</div>
			<div class="space-y-3">
				<!-- Title -->
				<div class="text-txtHint ml-1 text-sm font-semibold">Social</div>
				<MenuItem
					icon={IconUser}
					label="Friends"
					selected={page.url.pathname === '/settings/export'}
				/>
				<button
					class={[
						`border-txtPrimary text-txtPrimary hover:bg-baseAlt1
						active:bg-baseAlt2 flex min-h-10 w-full
						cursor-pointer items-center justify-center
						gap-2 rounded-sm border-2 px-4 py-1 text-sm
						font-semibold transition-colors duration-300 select-none
						focus:outline-hidden disabled:pointer-events-none`
					]}
				>
					<IconPlus class="size-5" />
					<span>Add a friend</span>
				</button>
			</div>
		</div>
	</aside>
	<div class="flex-1 overflow-y-scroll p-7">
		{@render children()}
	</div>
</div>
