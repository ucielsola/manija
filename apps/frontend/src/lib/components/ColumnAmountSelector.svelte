<script lang="ts">
	import { app, sourceList } from '$lib/stores';

	let pinnedSources = $derived(sourceList.pinned);
	let columnOptions = $derived(pinnedSources.map((s, index) => index + 1));

	const handleSelect = (option: number) => {
		app.columns = option;
	};
</script>

{#if columnOptions.length > 0}
	<select
		class="select select-sm select-primary"
		onchange={(e) => handleSelect(Number((e.target as HTMLSelectElement).value))}
	>
		{#each columnOptions as option}
			<option class="flex items-center justify-between">
				{option}
			</option>
		{/each}
	</select>
{/if}
