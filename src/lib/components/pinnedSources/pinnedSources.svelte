<script lang="ts">
	import { sources } from '$lib/stores/sources.svelte';
	import Source from '$lib/components/source/source.svelte';
	import ScrollArea from '../ui/scroll-area/scroll-area.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';

	const maxColumns = 4;
	let columnOptions = $derived(sources.pinned.map((s, index) => index + 1).slice(0, maxColumns));
	let columns = $state(1);
	let maxWidth = $state(0);
	$inspect(columnOptions);

	onMount(() => {
		const updateMaxWidth = () => {
			maxWidth = document.body.clientWidth - 64;
		};

		updateMaxWidth();
		window.addEventListener('resize', updateMaxWidth);
	});

	$inspect(maxWidth);
</script>

<div class="h-full w-full">
	{#if sources.pinned.length}
		<div class="flex flex-col items-end justify-center gap-2">
			<Label class="text-primary-foreground">Columnas</Label>

			<div class="flex items-center gap-2">
				{#each columnOptions as option}
					<Button
						size="icon"
						variant="outline"
						class={`transition-all duration-200 ${columns === option ? 'pointer-events-none cursor-auto opacity-30' : ''}`}
						onclick={() => (columns = option)}>{option}</Button
					>
				{/each}
			</div>
		</div>
	{/if}

	<ScrollArea orientation="vertical" class="p-8 pt-0">
		<div class="grid grid-cols-{columns} h-full gap-2 overflow-hidden">
			{#each sources.pinned as source}
				<div style={`max-width: ${maxWidth}px;`}>
					<Source {source} enableInteraction />
				</div>
			{/each}
		</div>
	</ScrollArea>

	{#if sources.pinned.length === 0}
		<div class="flex grow flex-col items-center justify-center gap-4 h-full">
			<div class="rounded-md border border-dashed px-8 py-6">
				<span class="text-lg font-semibold text-primary-foreground">
					No fijaste ninguna fuente
				</span>
			</div>
		</div>
	{/if}
</div>
