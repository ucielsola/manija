<script lang="ts">
	import AddSourceDialog from '$lib/components/addSourceDialog/addSourceDialog.svelte';
	import ConfirmDeleteAllDialog from '$lib/components/confirmDeleteAllDialog/confirmDeleteAllDialog.svelte';
	import SourcesMenu from '$lib/components/sourcesMenu/sourcesMenu.svelte';
	import SourceList from '$lib/components/sourceList/sourceList.svelte';
	import { Tv } from 'lucide-svelte';
	import { sourceStore } from '$lib/stores/sources.svelte';
	import PinnedSources from '$lib/components/pinnedSources/pinnedSources.svelte';
	import { ThemeSwitcher } from 'kampsy-ui';
	import { onMount } from 'svelte';
	import ColumnAmountSelector from '$lib/components/pinnedSources/columnAmountSelector.svelte';

	let isOpenAddSourceDialog = $state(false);
	let isOpenDeleteAllDialog = $state(false);
	let isDeleting = $derived(sourceStore.isDeleting);

	let windowClickTimeout: number;

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
				sourceStore.toggleDeleteMode();
			}
		}, 100);
	};

	$effect(() => {
		if (isDeleting) {
			window.addEventListener('click', windowClick);
		} else {
			window.removeEventListener('click', windowClick);
			clearTimeout(windowClickTimeout);
		}
	});

	onMount(() => {
		sourceStore.recoverState();
	});
</script>

<AddSourceDialog bind:open={isOpenAddSourceDialog} />
<ConfirmDeleteAllDialog bind:open={isOpenDeleteAllDialog} />

<div class="flex h-full flex-col gap-4 overflow-hidden">
	<div class="flex items-center justify-between border-b px-6">
		<div class="text-primary-foreground flex items-center gap-4">
			<Tv class="h-10 w-10 " />
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Manija TV</h1>
		</div>

		<div class="flex items-center gap-4 p-6">
			<div class="flex items-center gap-4">
				<ColumnAmountSelector />
				<SourcesMenu {onAddSource} {onDeleteAll} />
			</div>

			<ThemeSwitcher />
		</div>
	</div>

	<div class="flex h-full flex-col overflow-auto">
		<div class="grow">
			<PinnedSources {onAddSource} />
		</div>

		<div class="border-t p-6 pt-2 h-96">
			<SourceList {onAddSource} />
		</div>
	</div>
</div>
