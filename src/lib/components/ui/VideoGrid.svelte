<script lang="ts">
	import type { Source } from '$lib/models/source.svelte';
	import VideoPlayer from '$lib/components/ui/VideoPlayer.svelte';
	import VideoPlayerSkeleton from '$lib/components/ui/VideoPlayerSkeleton.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { PlayCircle } from 'lucide-svelte';
	import { app } from '$lib/stores';

	let {
		sources,
		onClose,
		loading = false
	}: {
		sources: Source[];
		onClose: (id: string) => void;
		loading?: boolean;
	} = $props();

	let gridColumns = $derived(app.columns);
</script>

{#if loading}
	<div
		class="grid h-full auto-rows-min gap-4 overflow-scroll py-8 align-top transition-all duration-300"
		style={`grid-template-columns: repeat(${gridColumns}, 1fr);`}
	>
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each Array(6) as _, i (i)}
			<VideoPlayerSkeleton />
		{/each}
	</div>
{:else if sources.length === 0}
	<div
		class="bg-surface-container-low flex h-full flex-col items-center justify-center rounded-lg px-8 py-12 text-center"
	>
		<div
			class="bg-surface-container-high mb-4 flex h-20 w-20 items-center justify-center rounded-full"
		>
			<PlayCircle size={40} class="text-neutral-400" />
		</div>
		<p class="font-label mb-4 text-lg text-neutral-500">No hay streams disponibles</p>
		<Button variant="primary">+ Agregar Video</Button>
	</div>
{:else}
	<div
		class="grid h-full auto-rows-min gap-4 overflow-scroll py-8 align-top transition-all duration-300"
		style={`grid-template-columns: repeat(${gridColumns}, 1fr);`}
	>
		{#each sources as source (source.id)}
			<VideoPlayer {source} onClose={() => onClose(source.id)} />
		{/each}
	</div>
{/if}
