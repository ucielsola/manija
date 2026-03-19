<script lang="ts">
	import { Pin, PinOff, Trash, Pencil } from '$lib/components/icons';
	import { Hoverable } from '$lib/components/common';
	import { app, sourceList, toastStore } from '$lib/stores';
	import type { Source } from '$lib/models/source.svelte';

	let { source }: { source: Source } = $props();

	let loaded = $state(false);
	let hovered = $state(false);

	const handleHover = (isHovered: boolean) => {
		hovered = isHovered;
	};

	const handlePin = () => {
		sourceList.toggleSourcePin(source.id);
	};

	const handleDelete = () => {
		sourceList.deleteSource(source.id, () => {
			toastStore.addToast({
				text: 'Video eliminado',
				type: 'primary'
			});
		});
	};

	const handleRename = () => {
		app.renamingSourceId = source.id;
	};
</script>

<Hoverable onHoverChange={handleHover}>
	<div class="border-primary relative aspect-video w-full rounded-md border">
		<figure class="border-primary relative h-full w-full overflow-hidden rounded-md">
			<img
				src={source.thumbnail}
				alt={source.name}
				class={`border-primary h-full w-full scale-105 rounded-md ${loaded ? 'opacity-100' : 'opacity-0'}`}
				onload={() => (loaded = true)}
			/>
		</figure>

		<div
			class={`bg-base-200/0 absolute top-0 left-0 flex h-full w-full flex-col justify-center gap-2 ${hovered
				? 'opacity-100'
				: 'opacity-0'} transition-opacity duration-300`}
		>
			<div class="bg-primary absolute top-0 left-0 w-full rounded-t-md px-2">
				<span class="text-primary-content text-sm font-semibold">{source.name}</span>
			</div>

			<div class="flex items-center justify-center gap-2">
				<button
					class="btn btn-square btn-sm {source.pinned ? 'btn-soft btn-primary' : 'btn-primary'}"
					onclick={handlePin}
					aria-label={source.pinned ? 'Unpin' : 'Pin'}
				>
					{#if source.pinned}
						<PinOff className="w-5 h-5" />
					{:else}
						<Pin className="w-5 h-5" />
					{/if}
				</button>

				<button
					class="btn btn-square btn-sm btn-primary"
					onclick={handleRename}
					aria-label="Delete"
				>
					<Pencil className="w-5 h-5" />
				</button>

				<button class="btn btn-square btn-sm btn-error" onclick={handleDelete} aria-label="Delete">
					<Trash className="w-5 h-5" />
				</button>
			</div>
		</div>
	</div>
</Hoverable>
