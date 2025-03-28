<script lang="ts">
	import { Plus } from '$lib/components/icons';
	
	import Source from '$lib/components/Source.svelte';
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
					<Source {source} />
				{/each}

				<div class="flex min-h-48 gap-4">
					<div
						class="flex h-full w-full items-center justify-center gap-4 rounded-md border border-primary border-dashed px-8 py-6"
					>
						<button
							class="btn btn-outline btn-wide btn-primary"
							onclick={() => (app.showAddSource = true)}
							aria-label="Add Video"
						>
							<Plus className="w-4 h-4" />
							Agregar Video
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
