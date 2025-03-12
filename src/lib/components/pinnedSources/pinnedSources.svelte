<script lang="ts">
	import { sources } from '$lib/stores/sources.svelte';
	import Source from '$lib/components/source/source.svelte';
	import { onMount } from 'svelte';
	import { Button } from 'kampsy-ui';

	const maxColumns = 4;
	
	let { onAddSource }: { onAddSource: () => void } = $props();
	
	let columnOptions = $derived(sources.pinned.map((s, index) => index + 1).slice(0, maxColumns));
	let columns = $state(1);
	let maxWidth = $state(0);

	onMount(() => {
		const updateMaxWidth = () => {
			maxWidth = document.body.clientWidth - 64;
		};

		updateMaxWidth();
		window.addEventListener('resize', updateMaxWidth);
	});

	$inspect(columns)
</script>

<div class="flex flex-col h-full w-full overflow-hidden">
	{#if sources.pinned.length > 1}
		<div class="flex flex-col items-end justify-center gap-2 p-6">
			<span class="text-primary-foreground">Columnas</span>

			<div class="flex items-center gap-2">
				{#each columnOptions as option}
					<Button shape="square" size="tiny" type="secondary" onclick={() => (columns = option)}>
						{option}
					</Button>
				{/each}
			</div>
		</div>
	{/if}

	<div class="p-8 pt-0">
		<div class="grid h-full gap-2 overflow-scroll"
			style={`grid-template-columns: repeat(${columns}, 1fr);`}
		>
			{#each sources.pinned as source}
				<div style={`max-width: ${maxWidth}px;`}>
					<Source {source} enableInteraction />
				</div>
			{/each}
		</div>
	</div>

	{#if sources.pinned.length === 0}
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
