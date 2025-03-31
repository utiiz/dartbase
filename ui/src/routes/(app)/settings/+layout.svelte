<script lang="ts">
	import MenuItem from '$lib/menu-item.svelte';
	import IconHomeGear from '$lib/icon-home-gear.svelte';
	import IconSendPlane from '$lib/icon-send-plane.svelte';
	import IconArchiveDrawer from '$lib/icon-archive-drawer.svelte';
	import IconArchive from '$lib/icon-archive.svelte';
	import IconTime from '$lib/icon-time.svelte';
	import IconUninstall from '$lib/icon-uninstall.svelte';
	import IconInstall from '$lib/icon-install.svelte';
	import { page } from '$app/state';
	import IconUser from '$lib/icon-user.svelte';

	let { children, data } = $props();
</script>

<div class="flex h-full">
	<aside
		class="bg-base border-baseAlt2 flex h-full w-[var(--page-sidebar-width)] flex-col justify-between border-r px-3 py-5"
	>
		<div class="flex flex-col gap-9">
			<div class="space-y-3">
				<!-- Title -->
				<div class="text-txtHint ml-1 text-sm font-semibold">System</div>
				<MenuItem
					icon={IconHomeGear}
					label="Application"
					link="/settings"
					selected={page.url.pathname === '/settings'}
				/>
				<MenuItem
					icon={IconUser}
					label="User"
					link="/settings/user"
					selected={page.url.pathname === '/settings/user'}
				/>
				<MenuItem
					icon={IconSendPlane}
					label="Mail settings"
					selected={page.url.pathname === '/settings/mail'}
				/>
				<MenuItem
					icon={IconArchiveDrawer}
					label="Files storage"
					selected={page.url.pathname === '/settings/storage'}
				/>
				<MenuItem
					icon={IconArchive}
					label="Backups"
					selected={page.url.pathname === '/settings/backups'}
				/>
				<MenuItem
					icon={IconTime}
					label="Crons"
					selected={page.url.pathname === '/settings/crons'}
				/>
			</div>
			<div class="space-y-3">
				<!-- Title -->
				<div class="text-txtHint ml-1 text-sm font-semibold">Sync</div>
				<MenuItem
					icon={IconUninstall}
					label="Export collections"
					selected={page.url.pathname === '/settings/export'}
				/>
				<MenuItem
					icon={IconInstall}
					label="Import collections"
					selected={page.url.pathname === '/settings/import'}
				/>
			</div>
		</div>
	</aside>
	<div class="flex-1 p-7">
		{@render children()}
	</div>
</div>
