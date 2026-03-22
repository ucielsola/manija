<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Grid, VolumeX, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { app } from '$lib/stores';

	let {
		children,
		activeStreams = 0,
		onMuteAll
	}: {
		children: Snippet;
		activeStreams?: number;
		onMuteAll?: () => void;
	} = $props();

	let showGridDropdown = $state(false);
</script>

<aside
	class="bg-surface-container-low fixed top-14 left-0 z-40 flex h-[calc(100vh-3.5rem)] w-64 flex-col transition-all duration-300"
>
	<div class="flex flex-col gap-1 p-6">
		<span class="font-body text-primary text-xs font-medium tracking-widest uppercase"
			>Centro de Comando</span
		>
		<span class="text-[10px] tracking-tighter text-neutral-500 uppercase"
			>Streams Activos: {activeStreams}</span
		>

		<div class="relative mt-2">
			<button
				onclick={() => (showGridDropdown = !showGridDropdown)}
				class="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-bold tracking-widest text-neutral-400 uppercase transition-all hover:bg-white/5 hover:text-neutral-200 active:scale-95"
			>
				<div class="flex items-center gap-2">
					<Grid size={14} />
					<span>Grilla</span>
				</div>
				{#if showGridDropdown}
					<ChevronUp size={14} />
				{:else}
					<ChevronDown size={14} />
				{/if}
			</button>

			{#if showGridDropdown}
				<div
					class="bg-surface-container-low absolute top-full left-0 z-20 mt-1 w-full overflow-hidden rounded-md border border-white/10 shadow-lg"
				>
					<button
						onclick={() => {
							app.columns = 1;
							showGridDropdown = false;
						}}
						class="flex w-full items-center justify-between px-3 py-2 text-xs font-medium {app.columns ===
						1
							? 'text-primary'
							: 'text-neutral-400'} hover:bg-white/10 hover:text-neutral-200"
					>
						<span>1 Columna</span>
						{#if app.columns === 1}
							<span class="text-primary">✓</span>
						{/if}
					</button>
					<button
						onclick={() => {
							app.columns = 2;
							showGridDropdown = false;
						}}
						class="flex w-full items-center justify-between px-3 py-2 text-xs font-medium {app.columns ===
						2
							? 'text-primary'
							: 'text-neutral-400'} hover:bg-white/10 hover:text-neutral-200"
					>
						<span>2 Columnas</span>
						{#if app.columns === 2}
							<span class="text-primary">✓</span>
						{/if}
					</button>
					<button
						onclick={() => {
							app.columns = 3;
							showGridDropdown = false;
						}}
						class="flex w-full items-center justify-between px-3 py-2 text-xs font-medium {app.columns ===
						3
							? 'text-primary'
							: 'text-neutral-400'} hover:bg-white/10 hover:text-neutral-200"
					>
						<span>3 Columnas</span>
						{#if app.columns === 3}
							<span class="text-primary">✓</span>
						{/if}
					</button>
					<button
						onclick={() => {
							app.columns = 4;
							showGridDropdown = false;
						}}
						class="flex w-full items-center justify-between px-3 py-2 text-xs font-medium {app.columns ===
						4
							? 'text-primary'
							: 'text-neutral-400'} hover:bg-white/10 hover:text-neutral-200"
					>
						<span>4 Columnas</span>
						{#if app.columns === 4}
							<span class="text-primary">✓</span>
						{/if}
					</button>
				</div>
			{/if}
		</div>

		{#if onMuteAll}
			<button
				onclick={onMuteAll}
				class="mt-1 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-bold tracking-widest text-neutral-400 uppercase transition-all hover:bg-white/5 hover:text-neutral-200 active:scale-95"
			>
				<VolumeX size={14} />
				<span>Mutear Todos</span>
			</button>
		{/if}
	</div>

	<nav class="flex-1 overflow-y-auto px-3">{@render children()}</nav>
</aside>
