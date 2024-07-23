<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	import { toast } from 'svelte-sonner';
	import { Pin, PinOff, RefreshCw, Trash2 } from 'lucide-svelte';

	import Label from '$lib/components/ui/label/label.svelte';
	import ButtonWithTooltip from '$lib/components/buttonWithTooltip/buttonWithTooltip.svelte';
	import IframeSkeleton from '$lib/components/source/sourceSkeleton.svelte';

	import {
		deleteSource,
		pinSource,
		sources,
		toggleDeleteSuccess,
		unpinSource
	} from '$lib/stores/sources.svelte';

	import type { Source } from '$lib/types/Source';

	let { source, enableInteraction }: { source: Source; enableInteraction?: boolean } = $props();

	let loaded = $state(false);
	let isHovering = $state(false);
	let isPinned = $derived(sources.pinned.map((s) => s.id).includes(source.id));
	let reloadCount = $state(0);
	let showMenu = $derived(sources.isDeleting || isHovering);
	let disabled = $derived(isPinned && !enableInteraction);

	let hoverTimeout: number;
	let hoverTimeoutDuration = 500;

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
		deleteSource(source.id);
	};

	const onTogglePin = () => {
		if (!isPinned) {
			pinSource(source);
		} else {
			unpinSource(source);
		}
	};

	const onReload = () => {
		loaded = false;
		reloadCount += 1;
	};

	$effect(() => {
		if (sources.deleteSuccess) {
			toast.success('Fuente borrada');
			toggleDeleteSuccess();
		}
	});
</script>

<div>
	<div class="relative w-fit rounded-t-sm bg-primary-foreground px-6">
		<Label class="text-primary">{source.name}</Label>

		{#if isPinned}
			<Pin class="pointer-events-none absolute right-0.5 top-0.5 h-3 w-3 rotate-45" />
		{/if}
	</div>

	<div
		class="relative aspect-video h-full w-full min-w-96 overflow-visible rounded-sm rounded-tl-none {showMenu &&
			'rounded-tr-none'} border border-primary-foreground transition-all duration-300"
		out:fade={{ duration: 100, delay: 0 }}
		onmouseenter={() => onHoverChange(true)}
		onmouseleave={() => onHoverChange(false)}
		role="button"
		tabindex="0"
	>
		{#if showMenu}
			<div
				class="justify-evently absolute -right-[1px] -top-7 z-0 flex w-fit cursor-default items-center gap-3 rounded-t-sm bg-secondary px-2 py-1"
				in:fly={{ duration: 300, delay: 0, y: 10 }}
				out:fly={{ duration: 300, y: 20, delay: 100 }}
			>
				<ButtonWithTooltip tooltipText="Recargar">
					<button onclick={onReload}>
						<RefreshCw class="pointer-events-none h-4 w-4" />
					</button>
				</ButtonWithTooltip>

				<div class="mb-1 h-4 w-0 border-r border-dashed border-primary/60"></div>

				<ButtonWithTooltip tooltipText={isPinned ? 'Quitar' : 'Fijar'}>
					<button onclick={onTogglePin}>
						{#if isPinned}
							<PinOff class="pointer-events-none h-4 w-4" />
						{:else}
							<Pin class="pointer-events-none h-4 w-4" />
						{/if}
					</button>
				</ButtonWithTooltip>

				<div class="mb-1 h-4 w-0 border-r border-dashed border-primary/60"></div>

				<ButtonWithTooltip tooltipText="Borrar fuente">
					<button onclick={onDeleteSource} data-delete-source>
						<Trash2 class="pointer-events-none h-4 w-4" />
					</button>
				</ButtonWithTooltip>
			</div>
		{/if}

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
