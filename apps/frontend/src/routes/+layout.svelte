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

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			app.dismissOpenDialogs()
		}
	};
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex h-dvh w-dvw flex-col-reverse overflow-hidden" data-theme={app.theme}>
	<div class="flex grow overflow-hidden">
		{#if app.loaded}
			<div class="relative flex h-full w-full grow overflow-hidden" in:fade>
				<SideBarToggle />
				<SideBar />
				<div class="relative z-10 grow overflow-hidden">
					{@render children()}
				</div>
			</div>
		{:else}
			<div class="flex h-full w-full items-center justify-center">
				<Tv className="h-48 w-48 text-primary animate-pulse" />
			</div>
		{/if}
	</div>

	{#if app.loaded}
		<div in:fade>
			<TopBar />
		</div>
	{/if}
</div>

<Toasts />
<AddSourceDialog />
<ConfirmDeleteAllDialog />
<RenameSourceDialog />
