<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'primary',
		children,
		onclick
	}: {
		variant?: 'primary' | 'secondary' | 'tertiary';
		children: Snippet;
		onclick?: () => void;
	} = $props();
</script>

<button
	{onclick}
	class="rounded-md px-2.5 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all active:scale-95 {variant ===
	'primary'
		? 'btn-gradient text-on-primary shadow-primary/20 shadow-lg hover:opacity-90'
		: variant === 'secondary'
			? 'btn-ghost hover:text-secondary text-neutral-400'
			: 'text-neutral-400 hover:text-white'}"
>
	{@render children()}
</button>
