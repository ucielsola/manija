<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Source } from '$lib/models/source.svelte';
	import SourceItem from '$lib/components/ui/SourceItem.svelte';
	import SourceItemSkeleton from '$lib/components/ui/SourceItemSkeleton.svelte';

	let {
		sources,
		loading,
		emptyMessage,
		onPinToggle,
		onAdd,
		showPinButton = true,
		isPinned,
		children
	}: {
		sources: Source[];
		loading: boolean;
		emptyMessage: string;
		onPinToggle: (id: string) => void;
		onAdd?: (source: Source) => void;
		showPinButton?: boolean;
		isPinned?: (id: string) => boolean;
		children?: Snippet;
	} = $props();
</script>

{#if loading}
	<SourceItemSkeleton count={5} />
{:else if sources.length === 0}
	<div class="space-y-3 px-3 pt-3">
		<div
			class="bg-surface-container-low flex flex-col items-center justify-center rounded-lg px-4 py-6 text-center"
		>
			<p class="font-label mb-3 text-sm text-neutral-500">{emptyMessage}</p>
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
{:else}
	<div class="space-y-2 px-3 pt-2">
		{#each sources as source (source.id)}
			<SourceItem
				{source}
				isPinned={isPinned ? () => isPinned(source.id) : source.pinned}
				{onPinToggle}
				{onAdd}
				{showPinButton}
			/>
		{/each}
	</div>
	{#if children}
		<div class="px-3 pt-4">{@render children()}</div>
	{/if}
{/if}
