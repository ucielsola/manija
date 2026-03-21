<script lang="ts">
	import Source from '$lib/components/Source.svelte';
	import Guide from '$lib/components/Guide.svelte';

	import { app, sourceList, apiSourceList } from '$lib/stores';
	import { fade } from 'svelte/transition';

	let columns = $derived(app.columns);
	let pinnedSources = $derived([...sourceList.pinned, ...apiSourceList.pinned]);
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	{#if sourceList.loading || apiSourceList.loading}
		<div class="h-full w-full flex items-center justify-center">
			<span class="loading loading-spinner loading-lg text-primary"></span>
		</div>
	{:else if pinnedSources.length === 0}
		<div class="h-full w-full" in:fade|global={{ delay: 600 }}>
			<Guide />
		</div>
	{:else}
		<div class="h-full overflow-hidden p-8 pt-0">
			<div
				class="grid h-full auto-rows-min gap-4 overflow-scroll py-8 align-top transition-all duration-300"
				style={`grid-template-columns: repeat(${columns}, 1fr);`}
			>
				{#each pinnedSources as source (source.id)}
					<Source {source} />
				{/each}
			</div>
		</div>
	{/if}
</div>
