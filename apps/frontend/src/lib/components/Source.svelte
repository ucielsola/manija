<script lang="ts">
	import { fade } from 'svelte/transition';

	import { PinOff, Pin, Trash, Refresh } from '$lib/components/icons';

	import { Hoverable } from '$lib/components/common';

	import { sourceList, toastStore } from '$lib/stores';

	import type { Source } from '$lib/models/source.svelte';


	let { source }: { source: Source } = $props();

	let iframe: HTMLIFrameElement;

	let loaded = $state(false);
	let disabled = $state(false);
	let isHovered = $state(false);
	let refreshCount = $state(0);

	const onLoad = () => {
		loaded = true;
		source.attachController(iframe);
	};

	const onHoverChange = (hovered: boolean) => {
		isHovered = hovered;
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

	const handleRefresh = () => {
		refreshCount++;
	};
</script>

{#key refreshCount}
	<Hoverable {onHoverChange}>
		{#if isHovered}
			<div
				transition:fade
				class="absolute right-0 top-0 z-20 flex h-fit w-fit items-center justify-end"
			>
				<div class="bg-accent flex items-center justify-center gap-2 rounded-bl-lg p-3">
					<button class="btn btn-square btn-sm btn-secondary" onclick={handleRefresh}>
						<Refresh className="w-5 h-5" />
					</button>

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
		{/if}
		<iframe
			bind:this={iframe}
			class="relative z-10 aspect-video w-full rounded-sm rounded-tl-none transition-opacity duration-300 ease-in-out"
			class:pointer-events-none={disabled}
			class:opacity-60={disabled}
			class:grayscale={disabled}
			class:opacity-0={!loaded}
			class:opacity-100={loaded}
			src={source.embedUrl}
			title={source.name}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
			role="button"
			tabindex="0"
			onload={onLoad}
		>
		</iframe>
	</Hoverable>
{/key}
