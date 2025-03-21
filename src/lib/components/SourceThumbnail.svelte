<script lang="ts">
	import { Pin, PinOff, Trash } from '$lib/components/icons';
	import { Hoverable } from '$lib/components/common';
	import { sourceList, toastStore } from '$lib/stores';
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
				type: 'success'
			});
		});
	};
</script>

<Hoverable onHoverChange={handleHover}>
	<div class="relative w-full aspect-video rounded-md border border-primary">
		<figure class="relative w-full h-full rounded-md border-primary overflow-hidden">
			<img
				src={source.thumbnail}
				alt={source.name}
				class={`w-full h-full rounded-md border-primary scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
				onload={() => (loaded = true)}
			/>
		</figure>

		<div
			class="absolute top-0 left-0 flex flex-col gap-2 justify-center w-full h-full bg-base-200/0 {hovered
				? 'opacity-100'
				: 'opacity-0'} transition-opacity"
		>
			<div class="absolute top-0 left-0 w-full bg-primary rounded-t-md px-2">
				<span class="text-primary-content font-semibold text-sm">{source.name}</span>
			</div>

			<div class="flex items-center gap-2 justify-center">
				<button
					class="btn btn-square btn-sm {source.pinned ? 'btn-soft btn-primary' : 'btn-primary'}"
					onclick={handlePin}
				>
					{#if source.pinned}
						<PinOff className="w-5 h-5" />
					{:else}
						<Pin className="w-5 h-5" />
					{/if}
				</button>

				<button class="btn btn-square btn-sm btn-error" onclick={handleDelete}>
					<Trash className="w-5 h-5" />
				</button>
			</div>
		</div>
	</div>
</Hoverable>
