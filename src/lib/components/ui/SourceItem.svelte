<script lang="ts">
	import type { Source } from '$lib/models/source.svelte';
	import { Pin, PinOff } from 'lucide-svelte';

	let {
		source,
		isPinned,
		onPinToggle,
		onAdd,
		showPinButton = true
	}: {
		source: Source;
		isPinned: boolean | (() => boolean);
		onPinToggle: (id: string) => void;
		onAdd?: (source: Source) => void;
		showPinButton?: boolean;
	} = $props();

	let pinnedState = $derived.by(() => (typeof isPinned === 'function' ? isPinned() : isPinned));
</script>

<div
	class="group relative flex w-full items-center gap-3 rounded-md px-3 py-1 transition-colors {pinnedState
		? 'bg-white/5'
		: 'hover:bg-white/5'}"
>
	<button onclick={() => onAdd?.(source)} class="flex flex-1 items-center gap-3 text-left">
		<div class="bg-surface-container-highest h-10 w-10 overflow-hidden rounded">
			<img
				src={source.thumbnail}
				alt={source.name}
				class="h-full w-full object-cover {pinnedState
					? ''
					: 'grayscale'} transition-all group-hover:grayscale-0"
			/>
		</div>
		<div class="flex flex-col">
			<span class="text-on-surface text-xs font-bold">{source.name}</span>
			<div class="flex items-center gap-1.5">
				<span class="bg-tertiary h-1.5 w-1.5 rounded-full"></span>
				<span class="text-[9px] text-neutral-500 uppercase">En Vivo Ahora</span>
			</div>
		</div>
	</button>

	{#if showPinButton}
		<button
			onclick={(e) => {
				e.stopPropagation();
				onPinToggle(source.id);
			}}
			class="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded bg-white/10 p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/20"
		>
			{#if !pinnedState}
				<Pin size={16} fill="currentColor" class="text-primary fill-current" />
			{:else}
				<PinOff size={16} class="text-red-500" />
			{/if}
		</button>
	{/if}
</div>
