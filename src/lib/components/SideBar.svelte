<script lang="ts">
	import { app, sourceList } from '$lib/stores';
	import { Plus } from '$lib/components/icons';
	import SourceThumbnail from '$lib/components/SourceThumbnail.svelte';

	let isCollapsed = $derived(app.sideBarCollapsed);
	let translate = $derived(isCollapsed ? 'translate-x-[-100%]' : 'translate-x-0');
	let width = $derived(isCollapsed ? 'w-0' : 'w-64');
</script>

<div class={`relative h-full ${width} overflow-visible transition-width duration-200`}>
	<div
		class={`relative h-full w-64 bg-base-100 border-r flex flex-col gap-4 pt-3 px-3 overflow-hidden transition-transform duration-200 ${translate}`}
	>
		<button class="btn btn-outline btn-wide btn-sm btn-primary mt-8" onclick={() => app.showAddSource = true}>
			<Plus className="w-4 h-4" />
			Agregar Video
		</button>

		<div class="w-full flex flex-col gap-3">
			{#each sourceList.sources as source (source.id)}
				<SourceThumbnail {source} />
			{:else}
				<div class="flex items-center justify-center rounded-md border border-dashed p-6">
					<span class="text-primary-foreground text-xs font-semibold">
						Todavía no agregaste videos
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>
