<script lang="ts">
	import { Menu } from 'kampsy-ui';
	import { CheckCircle } from 'kampsy-ui/icons';

	import { sourceStore } from '$lib/stores/sources.svelte';

	let pinnedSources = $derived(sourceStore.pinnedSources);
	let columnOptions = $derived(pinnedSources.map((s, index) => index + 1))
	let selectedColumn = $derived(sourceStore.columns);
</script>

{#if pinnedSources.length > 1}
	<div class="w-full">
		<Menu.Root>
			<Menu.Button>Columnas</Menu.Button>
			<Menu.Content class="w-[200px]">
				{#each columnOptions as option}
					<Menu.Item onClick={() => sourceStore.setColumns(option)} suffix={selectedColumn === option ? CheckCircle : undefined}>
						<span class="text-slate-900 dark:text-slate-200">
							{option}
						</span>
					</Menu.Item>
				{/each}
			</Menu.Content>
		</Menu.Root>
	</div>
{/if}
