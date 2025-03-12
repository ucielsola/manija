<script lang="ts">
	import { onMount } from 'svelte';
	
	import { Button } from 'kampsy-ui';
	
	import { sourceStore } from '$lib/stores/sources.svelte';

	import Source from '$lib/components/source/source.svelte';
	
	let { onAddSource }: { onAddSource: () => void } = $props();
	
	let maxWidth = $state(0);
	let columns = $derived(sourceStore.columns);
	let pinnedSources = $derived(sourceStore.pinnedSources);

	onMount(() => {
		const updateMaxWidth = () => {
			maxWidth = document.body.clientWidth - 64;
		};

		updateMaxWidth();
		window.addEventListener('resize', updateMaxWidth);
	});
</script>

<div class="flex flex-col h-full w-full overflow-hidden">
	<div class="p-8 pt-0">
		<div class="grid h-full gap-x-2 gap-y-8 overflow-scroll py-8"
			style={`grid-template-columns: repeat(${columns}, 1fr);`}
		>
			{#each pinnedSources as source}
				<div style={`max-width: ${maxWidth}px;`}>
					<Source {source} enableInteraction />
				</div>
			{/each}
		</div>
	</div>

	{#if pinnedSources.length === 0}
		<div class="flex h-full grow flex-col items-center justify-center gap-4">
			<div class="flex flex-col gap-4 rounded-md border border-dashed px-8 py-6">
				<span class="text-primary-foreground text-lg font-semibold">
					No fijaste ninguna fuente
				</span>
				<Button type="secondary" onclick={onAddSource}>Agregar Fuente</Button>
			</div>
		</div>
	{/if}
</div>
