<script lang="ts">
	import NewSource from '$lib/components/Source.svelte';
	import Guide from '$lib/components/Guide.svelte';

	import { app, sourceList } from '$lib/stores';

	let columns = $derived(app.columns);
	let pinnedSources = $derived(sourceList.pinned);
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	{#if pinnedSources.length === 0}
		<Guide />
	{:else}
		<div class="h-full overflow-hidden p-8 pt-0">
			<div
				class="grid h-full auto-rows-min gap-4 overflow-scroll py-8 align-top"
				style={`grid-template-columns: repeat(${columns}, 1fr);`}
			>
				{#each pinnedSources as source (source.id)}
					<NewSource {source} />
				{/each}
			</div>
		</div>
	{/if}
</div>
