<script lang="ts">
	import { Plus } from 'lucide-svelte';

	import Input from '$lib/components/ui/input/input.svelte';
	import Source from '$lib/components/source/source.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import SourceSkeleton from '$lib/components/source/sourceSkeleton.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import ButtonWithTooltip from '$lib/components/buttonWithTooltip/buttonWithTooltip.svelte';
	
	import { sources } from '$lib/stores/sources.svelte';

	let { onAddSource }: { onAddSource: () => void } = $props();
	let filterQuery = $state('');
	let filteredSources = $derived(
		filterQuery.length
			? sources.list.filter((s) => s.name.toLowerCase().includes(filterQuery.toLowerCase()))
			: sources.list
	);
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between p-2">
		<h3 class="scroll-m-20 text-xl font-extrabold tracking-tight text-primary-foreground">
			Todas las fuentes
		</h3>

		<div class="w-48">
			<Input placeholder="Buscar fuentes" bind:value={filterQuery} />
		</div>
	</div>
	<ScrollArea class="flex items-center gap-8 p-2 py-0" orientation="horizontal">
		<div class="flex items-center gap-8 p-4 pl-0">
			{#if !sources.loaded}
				{#each Array(4) as _}
					<div
						class="relative aspect-video h-full w-full min-w-96 overflow-visible rounded-sm rounded-tl-none border border-primary-foreground"
					>
						<SourceSkeleton />
					</div>
				{/each}
			{:else}
				{#each filteredSources as source, index (index)}
					{@const isLast = index === filteredSources.length - 1}
					<Source {source} />

					{#if isLast}
						<ButtonWithTooltip tooltipText="Agregar Fuente">
							<button
								class="h-full w-full rounded-sm border border-dashed border-primary-foreground/60 p-8 transition-colors duration-100 hover:border-primary-foreground"
								onclick={onAddSource}
							>
								<Plus class="h-8 w-8 text-primary-foreground" />
							</button>
						</ButtonWithTooltip>
					{/if}
				{:else}
					<div class="grow flex flex-col gap-4 items-center justify-center">
						<div class="border border-dashed px-8 py-6 rounded-md">
							<span class="text-lg font-semibold text-primary-foreground">
								{#if filterQuery}
									No se encontraron fuentes
								{:else}
									No cargaste ninguna fuente
								{/if}
							</span>
						</div>
						<Button variant="outline" onclick={onAddSource}>Agregar Fuente</Button>
					</div>
				{/each}
			{/if}
		</div>
	</ScrollArea>
</div>
