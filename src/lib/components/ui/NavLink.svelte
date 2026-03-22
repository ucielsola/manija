<script lang="ts">
	import { Library, Tv2 } from 'lucide-svelte';

	let {
		icon,
		label,
		href,
		active = false,
		onclick
	}: {
		icon: string;
		label: string;
		href: string;
		active?: boolean;
		onclick?: (e: Event) => void;
	} = $props();

	const icons: Record<string, typeof Library> = { Library, Tv2 };
	let Icon = $derived(icons[icon] || Library);
</script>

<a
	{href}
	{onclick}
	class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 {active
		? 'bg-primary/10 text-primary border-primary border-r-2'
		: 'text-neutral-500 hover:bg-white/5 hover:text-neutral-200'} group transition-colors"
>
	<svelte:component this={Icon} size={16} class={active ? 'fill-primary' : ''} />
	<span class="font-body text-xs font-medium tracking-widest uppercase">{label}</span>
</a>
