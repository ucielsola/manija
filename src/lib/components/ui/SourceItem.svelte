<script lang="ts">
	import type { Source } from '$lib/models/source.svelte';
	import { Pin, PinOff } from 'lucide-svelte';

	let {
		source,
		isPinned,
		onPinToggle,
		showPinButton = true
	}: {
		source: Source;
		isPinned: boolean | (() => boolean);
		onPinToggle: (id: string) => void;
		showPinButton?: boolean;
	} = $props();

	let pinnedState = $derived.by(() => (typeof isPinned === 'function' ? isPinned() : isPinned));
</script>

<button
	type="button"
	aria-label={pinnedState
		? `Quitar ${source.name} de la grilla`
		: `Fijar ${source.name} en la grilla`}
	aria-pressed={pinnedState}
	title={pinnedState ? 'Quitar de la grilla' : 'Fijar en la grilla'}
	onclick={() => onPinToggle(source.id)}
	class="group focus-visible:ring-primary relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors focus-visible:ring-2 {pinnedState
		? 'bg-white/5'
		: 'hover:bg-white/5'}"
>
	<div class="bg-surface-container-highest size-10 shrink-0 overflow-hidden rounded">
		<img
			src={source.thumbnail}
			alt=""
			class="h-full w-full object-cover {pinnedState
				? ''
				: 'grayscale'} transition-all group-hover:grayscale-0"
		/>
	</div>
	<div class="flex min-w-0 flex-1 flex-col">
		<span class="text-on-surface truncate text-xs font-bold">{source.name}</span>
		<div class="flex items-center gap-1.5">
			<span class="bg-tertiary h-1.5 w-1.5 rounded-full"></span>
			<span class="text-[9px] text-neutral-500 uppercase">En Vivo Ahora</span>
		</div>
	</div>

	{#if showPinButton}
		<span class="rounded p-1">
			{#if !pinnedState}
				<Pin size={16} fill="currentColor" class="text-primary fill-current" />
			{:else}
				<PinOff size={16} class="text-red-500" />
			{/if}
		</span>
	{/if}
</button>
