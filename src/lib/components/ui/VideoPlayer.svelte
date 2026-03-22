<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { Source } from '$lib/models/source.svelte';

	let {
		source,
		title,
		channel,
		thumbnail,
		isActive = false,
		onClose
	}: {
		source?: Source;
		title?: string;
		channel?: string;
		thumbnail?: string;
		isActive?: boolean;
		onClose?: () => void;
	} = $props();

	let iframeRef: HTMLIFrameElement | null = $state(null);

	let isPlaceholder = $derived(!source);
	let displayTitle = $derived(source?.name || title);
	let displayChannel = $derived(channel);
	let displayThumbnail = $derived(source?.thumbnail || thumbnail);

	$effect(() => {
		if (!isPlaceholder && source && iframeRef) {
			console.log('[VideoPlayer] Attaching controller for:', displayTitle);
			source.attachController(iframeRef);
		}
	});
</script>

<div
	class="group surface-container-high relative aspect-video overflow-hidden rounded-lg bg-black transition-all duration-500 {isActive
		? 'ring-secondary/40 ring-2'
		: 'hover:ring-secondary/40 ring-1 ring-white/10'}"
>
	{#if !isPlaceholder}
		<iframe
			bind:this={iframeRef}
			src={source!.embedUrl}
			title={displayTitle}
			class="h-full w-full"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	{:else if displayThumbnail}
		<div class="absolute inset-0 flex items-center justify-center bg-neutral-900">
			<img
				src={displayThumbnail}
				alt={displayTitle}
				class="h-full w-full object-cover opacity-50"
			/>
			<div
				class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60"
			></div>
		</div>
	{/if}

	{#if onClose}
		<div class="absolute top-4 right-4 z-10 transition-all">
			<button
				onclick={onClose}
				class="hover:bg-error flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors"
			>
				<X size={16} />
			</button>
		</div>
	{/if}
</div>
