<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className
	}: { children: Snippet; class?: string } = $props();

	let container: HTMLElement;

	let handleKeyDown = (e: KeyboardEvent) => {
		if (e.key !== 'Tab') return;

		const focusable = Array.from(
			container.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		);
		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (e.shiftKey) {
			if (document.activeElement === first) {
				e.preventDefault();
				last.focus();
			}
		} else {
			if (document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	};

	onMount(() => {
		container.addEventListener('keydown', handleKeyDown);
	});

	onDestroy(() => {
		container.removeEventListener('keydown', handleKeyDown);
	});
</script>

<div bind:this={container} class={className}>
	{@render children()}
</div>
