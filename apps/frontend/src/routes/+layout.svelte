<script lang="ts">
	import { fade } from 'svelte/transition';

	import '../app.css';

	import { inject as injectVercelAnalytics } from '@vercel/analytics';

	import TopBar from '$lib/components/TopBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Toasts from '$lib/components/Toasts.svelte';

	import { app, sourceList } from '$lib/stores';

	import Intro from '$lib/components/Intro.svelte';
	import SideBarToggle from '$lib/components/SideBarToggle.svelte';
	import AddSourceDialog from '$lib/components/AddSourceDialog.svelte';
	import ConfirmDeleteAllDialog from '$lib/components/ConfirmDeleteAllDialog.svelte';
	import RenameSourceDialog from '$lib/components/RenameSourceDialog.svelte';
	import { SourcNameMaxLength } from '$lib/consts';
	import { sliceString } from '$lib/utils/sliceString';

	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutServerData } = $props();

	if (data.liveSources && data.liveSources.length > 0) {
		data.liveSources.forEach((source) => {
			sourceList.addSource({
				name: sliceString(source.video_title, SourcNameMaxLength),
				url: source.video_url
			});
		});
	}

	$effect(() => {
		app.checkClipboardAccess();

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
			app.dismissOpenDialogs();
		}
	};

	$inspect(app.showIntro);
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex h-dvh w-dvw flex-col-reverse overflow-hidden">
	{#if app.showIntro}
		<Intro />
	{:else}
		<div class="flex grow overflow-hidden" in:fade={{ delay: 400 }}>
			<div class="relative flex h-full w-full grow overflow-hidden" in:fade>
				<SideBarToggle />
				<SideBar />
				<div class="relative z-10 grow overflow-hidden">
					{@render children()}
				</div>
			</div>
		</div>

		<div in:fade={{ delay: 400 }}>
			<TopBar />
		</div>
	{/if}
</div>

<Toasts />
<AddSourceDialog />
<ConfirmDeleteAllDialog />
<RenameSourceDialog />
