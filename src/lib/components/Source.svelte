<script lang="ts">
	import type { Source } from '$lib/models/source.svelte';

	let { source }: { source: Source } = $props();
	
    let iframe: HTMLIFrameElement;

    let loaded = $state(false);
    let disabled = $state(false);

    const onLoad = () => {
        loaded = true;
        source.attachController(iframe);
    };
</script>

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
