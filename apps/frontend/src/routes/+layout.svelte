<script lang="ts">
	import { fade } from 'svelte/transition';

	import '../app.css';

	import { inject as injectVercelAnalytics } from '@vercel/analytics';

	import { Tv } from '$lib/components/icons';
	import TopBar from '$lib/components/TopBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Toasts from '$lib/components/Toasts.svelte';

	import { app, sourceList } from '$lib/stores';

	import type { Snippet } from 'svelte';
	import SideBarToggle from '$lib/components/SideBarToggle.svelte';
	import AddSourceDialog from '$lib/components/AddSourceDialog.svelte';
	import ConfirmDeleteAllDialog from '$lib/components/ConfirmDeleteAllDialog.svelte';
	import RenameSourceDialog from '$lib/components/RenameSourceDialog.svelte';

	let { children }: { children: Snippet } = $props();

	$effect(() => {
		injectVercelAnalytics();
		setTimeout(() => {
			app.initStorage();
			sourceList.initStorage();
			setTimeout(() => {
				app.toggleSidebar();
			}, 800);
		}, 800);
	});
</script>

<div class="h-dvh w-dvw flex flex-col overflow-hidden" data-theme={app.theme}>
	{#if app.loaded}
		<div in:fade>
			<TopBar />
		</div>
	{/if}

	<div class="flex grow overflow-hidden">
		{#if app.loaded}
			<div class="relative flex grow h-full w-full overflow-hidden" in:fade>
				<SideBarToggle />
				<SideBar />
				<div class="relative z-10 grow overflow-hidden">	
					{@render children()}
				</div>
			</div>
		{:else}
			<div class="flex items-center justify-center h-full w-full">
				<Tv className="h-48 w-48 text-primary animate-pulse" />
			</div>
		{/if}
	</div>
</div>

<Toasts />
<AddSourceDialog />
<ConfirmDeleteAllDialog />
<RenameSourceDialog />

