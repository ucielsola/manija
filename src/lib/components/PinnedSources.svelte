<script lang="ts">
	import NewSource from '$lib/components/Source.svelte';
	import Guide from '$lib/components/Guide.svelte';

	import { app, sourceList } from '$lib/stores';

	let columns = $derived(app.columns);
	let pinnedSources = $derived(sourceList.pinned);
</script>

<div class="flex flex-col h-full w-full overflow-hidden">
	<div class="p-8 pt-0 h-full overflow-hidden">
		<div
			class="grid h-full align-top gap-4 overflow-scroll py-8 auto-rows-min"
			style={`grid-template-columns: repeat(${columns}, 1fr);`}
		>
			{#each pinnedSources as source (source.id)}
				<NewSource {source} />
			{/each}
		</div>
	</div>

	{#if pinnedSources.length === 0}
		<Guide />
	{/if}
</div>
