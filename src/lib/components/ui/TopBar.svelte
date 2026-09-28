<script>
	import { Settings2, Tv } from 'lucide-svelte';
</script>

<header class="glass fixed top-0 z-50 flex h-14 w-full items-center justify-between px-6">
	<div class="text-primary flex items-center gap-3">
		<Tv />
		<span class=" font-headline pt-1 text-xl font-black">Manija TV</span>
	</div>
	<a
		href="/admin"
		class="text-on-surface-variant hover:text-primary inline-flex items-center gap-2 text-xs font-semibold transition-colors"
		aria-label="Administrar canales"
	>
		<Settings2 size={16} />
		<span class="hidden sm:inline">Administrar canales</span>
	</a>
</header>
