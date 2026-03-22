<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	let {
		title,
		expanded,
		onToggle,
		children
	}: { title: string; expanded: boolean; onToggle: () => void; children: Snippet } = $props();
</script>

<button
	onclick={onToggle}
	class="flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-white/5"
>
	<span
		class="text-xs font-bold tracking-widest uppercase {expanded
			? 'text-primary'
			: 'text-neutral-500'}"
	>
		{title}
	</span>
	{#if expanded}
		<ChevronUp size={16} class="text-primary" />
	{:else}
		<ChevronDown size={16} class="text-neutral-500" />
	{/if}
</button>

{#if expanded}
	{@render children()}
{/if}
