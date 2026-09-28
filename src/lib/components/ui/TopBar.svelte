<script lang="ts">
	import { Menu, Radio, Settings2, Tv, X } from 'lucide-svelte';

	let {
		onMenuToggle,
		menuOpen = false,
		activeStreams = 0
	}: {
		onMenuToggle: () => void;
		menuOpen?: boolean;
		activeStreams?: number;
	} = $props();
</script>

<header
	class="glass fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b border-white/5 px-3 sm:px-6"
>
	<div class="text-primary flex items-center gap-3">
		<button
			class="text-on-surface-variant hover:text-primary flex size-9 items-center justify-center rounded-lg transition-colors lg:hidden"
			aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
			aria-expanded={menuOpen}
			onclick={onMenuToggle}
		>
			{#if menuOpen}<X size={20} />{:else}<Menu size={20} />{/if}
		</button>
		<Tv size={21} />
		<span class="font-headline pt-0.5 text-lg font-black sm:text-xl">Manija TV</span>
	</div>
	<div class="flex items-center gap-2 sm:gap-4">
		{#if activeStreams > 0}
			<div
				class="border-secondary/20 bg-secondary/5 text-secondary hidden items-center gap-2 rounded-full border px-3 py-1.5 sm:flex"
			>
				<span class="bg-secondary size-1.5 animate-pulse rounded-full"></span>
				<span class="text-[10px] font-bold tracking-widest uppercase">{activeStreams} en vivo</span>
			</div>
		{/if}
		<a
			href="/admin"
			class="text-on-surface-variant hover:text-primary flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-white/5 sm:w-auto sm:gap-2 sm:px-3"
			aria-label="Administrar canales"
		>
			<Settings2 size={17} />
			<span class="hidden text-xs font-semibold sm:inline">Administrar canales</span>
		</a>
	</div>
</header>
