<script lang="ts">
	import type { Snippet } from 'svelte';
	import { PlayCircle } from 'lucide-svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div
	class="border-outline-variant/20 bg-surface-container-lowest group hover:bg-surface-container-low flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all"
>
	<div
		class="bg-surface-container-high group-hover:bg-primary/20 mb-3 flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
	>
		<PlayCircle
			size={32}
			class="text-outline group-hover:text-primary transition-all duration-300"
		/>
	</div>
	{#if children}
		{@render children()}
	{/if}
</div>
