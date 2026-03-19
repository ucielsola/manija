<script lang="ts">
	import { fade } from 'svelte/transition';

	import '../app.css';

	import { inject as injectVercelAnalytics } from '@vercel/analytics';

	import TopBar from '$lib/components/TopBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Toasts from '$lib/components/Toasts.svelte';

	import { app, sourceList } from '$lib/stores';

	import Intro from '$lib/components/Intro.svelte';
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

<div class="flex h-dvh w-dvw flex-col overflow-hidden">
	{#if app.showIntro}
		<Intro />
	{:else}
		<TopBar />
		<div class="flex grow overflow-hidden">
			<SideBar />
			<div class="flex grow overflow-hidden relative z-10">
				<div class="flex h-full w-full grow overflow-hidden">
					<div class="grow overflow-hidden" in:fade={{ delay: 400 }}>
						{@render children()}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<Toasts />
<AddSourceDialog />
<ConfirmDeleteAllDialog />
<RenameSourceDialog />
