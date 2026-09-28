<script lang="ts">
	import type { Source } from '$lib/models/source.svelte';
	import VideoPlayer from '$lib/components/ui/VideoPlayer.svelte';
	import VideoPlayerSkeleton from '$lib/components/ui/VideoPlayerSkeleton.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { ArrowRight, PlayCircle, Radio, Video } from 'lucide-svelte';
	import { app } from '$lib/stores';

	let {
		sources,
		onClose,
		loading = false,
		liveSourcesAvailable = 0,
		onBrowseChannels
	}: {
		sources: Source[];
		onClose: (id: string) => void;
		loading?: boolean;
		liveSourcesAvailable?: number;
		onBrowseChannels?: () => void;
	} = $props();

	let gridColumns = $derived(app.columns);
	let viewportWidth = $state(0);
	let responsiveColumns = $derived(
		viewportWidth < 640 ? 1 : viewportWidth < 1180 ? Math.min(gridColumns, 2) : gridColumns
	);
</script>

<svelte:window bind:innerWidth={viewportWidth} />

{#if loading}
	<div
		class="video-grid w-full gap-4 py-2 transition-all duration-300"
		style={`--grid-columns: ${responsiveColumns}`}
	>
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each Array(6) as _, i (i)}
			<VideoPlayerSkeleton />
		{/each}
	</div>
{:else if sources.length === 0}
	<div
		class="border-outline-variant/20 bg-surface-container-low flex min-h-[22rem] flex-col items-center justify-center rounded-2xl border px-6 py-12 text-center sm:min-h-[26rem] sm:px-10"
	>
		<div
			class="border-secondary/15 bg-secondary/5 text-secondary mb-5 flex size-16 items-center justify-center rounded-2xl border"
		>
			{#if liveSourcesAvailable > 0}<Radio size={28} />{:else}<PlayCircle size={28} />{/if}
		</div>
		{#if liveSourcesAvailable > 0}
			<p class="font-headline text-xl font-bold text-white">
				Hay {liveSourcesAvailable}
				{liveSourcesAvailable === 1 ? 'canal en vivo' : 'canales en vivo'}
			</p>
			<p class="mt-2 max-w-md text-sm leading-6 text-neutral-400">
				Fijá un canal desde Noticias Argentina para sumarlo a esta grilla.
			</p>
			{#if onBrowseChannels}
				<button
					onclick={onBrowseChannels}
					class="text-primary hover:bg-primary/10 mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-colors"
				>
					Ver canales en vivo <ArrowRight size={15} />
				</button>
			{/if}
		{:else}
			<p class="font-headline text-xl font-bold text-white">Esperando transmisiones</p>
			<p class="mt-2 max-w-md text-sm leading-6 text-neutral-400">
				Cuando uno de tus canales empiece a transmitir, aparecerá acá. También podés sumar un video
				propio.
			</p>
		{/if}
		<div class="mt-5">
			<Button variant="secondary" onclick={() => (app.showAddSource = true)}>
				<Video size={14} />
				Agregar video propio
			</Button>
		</div>
	</div>
{:else}
	<div
		class="video-grid w-full gap-4 pb-6 transition-all duration-300"
		style={`--grid-columns: ${responsiveColumns}`}
	>
		{#each sources as source (source.id)}
			<VideoPlayer {source} onClose={() => onClose(source.id)} />
		{/each}
	</div>
{/if}

<style>
	.video-grid {
		display: grid;
		grid-template-columns: repeat(var(--grid-columns, 1), minmax(0, 1fr));
		align-items: start;
	}
</style>
