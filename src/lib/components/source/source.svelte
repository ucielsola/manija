<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	import { toast } from 'svelte-sonner';

	import { Pin, PinOff, RefreshCw, Trash2 } from 'lucide-svelte';
	import { Button } from 'kampsy-ui';

	import IframeSkeleton from '$lib/components/source/sourceSkeleton.svelte';

	import { sourceStore } from '$lib/stores/sources.svelte';

	import type { Source } from '$lib/types/Source';

	let { source, enableInteraction }: { source: Source; enableInteraction?: boolean } = $props();

	let loaded = $state(false);
	let isHovering = $state(false);
	let isPinned = $derived(sourceStore.pinnedSources.map((s) => s.id).includes(source.id));
	let reloadCount = $state(0);
	let showMenu = $derived(sourceStore.isDeleting || isHovering);
	let disabled = $derived(isPinned && !enableInteraction);

	let hoverTimeout: number;
	let hoverTimeoutDuration = 100;

	const nameMaxLength = 30;

	const name = $derived(source.name.length > nameMaxLength ? source.name.slice(0, nameMaxLength) + '...' : source.name);

	const onClick = (e: Event) => {};

	const onLoad = (e: Event) => {
		loaded = true;
	};

	const onHoverChange = (isHover: boolean) => {
		if (isHover) {
			hoverTimeout = setTimeout(() => {
				isHovering = true;
			}, hoverTimeoutDuration);
		} else {
			clearTimeout(hoverTimeout);
			isHovering = false;
		}
	};

	const onDeleteSource = () => {
		sourceStore.deleteSource(source.id, () => {
			toast.success('Fuente borrada');
		});
	};

	const onTogglePin = () => {
		if (!isPinned) {
			sourceStore.pinSource(source);
		} else {
			sourceStore.unpinSource(source);
		}
	};

	const onReload = () => {
		loaded = false;
		reloadCount += 1;
	};
</script>

<div>
	<div
		class="relative aspect-video h-full w-full min-w-96 overflow-visible rounded-sm rounded-tl-none {showMenu &&
			'rounded-tr-none'} border-primary-foreground border transition-all duration-300"
		out:fade={{ duration: 100, delay: 0 }}
		onmouseenter={() => onHoverChange(true)}
		onmouseleave={() => onHoverChange(false)}
		role="button"
		tabindex="0"
	>
		<div
			class="justify-evently absolute -top-7 right-0 z-0 flex w-full cursor-default items-center rounded-t bg-slate-900 pb-2 dark:bg-slate-200"
			in:fly={{ duration: 300, delay: 0, y: 10 }}
			out:fly={{ duration: 300, y: 20, delay: 100 }}
		>
			<div class="grow px-2">
				<span class="text-slate-200 dark:text-slate-900">
					{name}
				</span>
			</div>

			<div class="flex w-8 items-center justify-center px-2 pt-1">
				<Button shape="square" size="tiny" onclick={onReload}>
					<RefreshCw class="pointer-events-none h-4 w-4" />
				</Button>
			</div>

			<div class="border-primary/60 mb-1 h-4 w-0 border-r border-dashed"></div>

			<div class="flex w-8 items-center justify-center px-2 pt-1">
				<Button shape="square" size="tiny" onclick={onTogglePin}>
					{#if isPinned}
						<PinOff class="pointer-events-none h-4 w-4" />
					{:else}
						<Pin class="pointer-events-none h-4 w-4" />
					{/if}
				</Button>
			</div>

			<div class="border-primary/60 mb-1 h-4 w-0 border-r border-dashed"></div>

			<div class="flex w-8 items-center justify-center px-2 pt-1">
				<Button shape="square" size="tiny" onclick={onDeleteSource}>
					<Trash2 class="pointer-events-none h-4 w-4" />
				</Button>
			</div>
		</div>

		{#key reloadCount}
			<iframe
				class="relative z-10 h-full w-full rounded-sm rounded-tl-none transition-opacity duration-300 ease-in-out"
				class:pointer-events-none={disabled}
				class:opacity-60={disabled}
				class:grayscale={disabled}
				class:opacity-0={!loaded}
				class:opacity-100={loaded}
				src={source.url}
				title={source.name}
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
				role="button"
				onkeydown={onClick}
				tabindex="0"
				onload={onLoad}
			>
			</iframe>
		{/key}

		{#if !loaded}
			<IframeSkeleton />
		{/if}
	</div>
</div>
