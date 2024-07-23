<script lang="ts">
	import AddSourceDialog from '$lib/components/addSourceDialog/addSourceDialog.svelte';
	import ConfirmDeleteAllDialog from '$lib/components/confirmDeleteAllDialog/confirmDeleteAllDialog.svelte';
	import DarkModeToggle from '$lib/components/darkModeToggle/darkModeToggle.svelte';
	import SourcesMenu from '$lib/components/sourcesMenu/sourcesMenu.svelte';
	import SourceList from '$lib/components/sourceList/sourceList.svelte';
	import * as Menubar from '$lib/components/ui/menubar';
	import { Tv } from 'lucide-svelte';
	import { initSources, sources } from '$lib/stores/sources.svelte';
	import { onMount } from 'svelte';
	import PinnedSources from '$lib/components/pinnedSources/pinnedSources.svelte';

	let isOpenAddSourceDialog = $state(false);
	let isOpenDeleteAllDialog = $state(false);
	let windowClickTimeout: number;
	let sourceListHeight = $state(0);
	let containerHeight = $state(0);

	const onAddSource = () => {
		isOpenAddSourceDialog = true;
	};

	const onDeleteAll = () => {
		isOpenDeleteAllDialog = true;
	};

	const windowClick = (e: MouseEvent) => {
		windowClickTimeout = setTimeout(() => {
			const elDataset = (e.target as HTMLElement)?.dataset;
			const isButtonDelete = !!elDataset.deleteSource;

			if (!isButtonDelete) {
				sources.isDeleting = false;
			}
		}, 100);
	};

	$effect(() => {
		if (sources.isDeleting) {
			window.addEventListener('click', windowClick);
		} else {
			window.removeEventListener('click', windowClick);
			clearTimeout(windowClickTimeout);
		}
	});

	onMount(initSources);
</script>

<AddSourceDialog bind:open={isOpenAddSourceDialog} />
<ConfirmDeleteAllDialog bind:open={isOpenDeleteAllDialog} />

<div class="flex h-full flex-col gap-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4 text-primary-foreground">
			<Tv class="h-10 w-10 " />
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Manija TV</h1>
		</div>

		<div class="flex items-center gap-4">
			<Menubar.Root>
				<SourcesMenu {onAddSource} {onDeleteAll} />
			</Menubar.Root>

			<DarkModeToggle />
		</div>
	</div>

	<div class="flex flex-col h-full pb-2">
		<div class="grow">
			<PinnedSources />
		</div>

		<SourceList {onAddSource} />
	</div>
</div>
