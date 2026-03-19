<script lang="ts">
	import { Plus } from '$lib/components/icons';

	import Source from '$lib/components/Source.svelte';
	import Guide from '$lib/components/Guide.svelte';

	import { app, sourceList } from '$lib/stores';
	import { fade } from 'svelte/transition';

	let columns = $derived(app.columns);
	let pinnedSources = $derived(sourceList.pinned);
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	{#if sourceList.loading}
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

				<div class="flex min-h-48 gap-4" in:fade|global={{ delay: 1000 }}>
					<div
						class="border-primary/30 flex h-full w-full items-center justify-center gap-4 rounded-lg border border-dashed px-8 py-6 transition-all hover:border-primary hover:bg-base-200/50"
					>
						<button
							class="btn btn-outline btn-wide btn-primary transition-all hover:scale-105"
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
