<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		onHoverChange,
		class: className
	}: { children: Snippet; onHoverChange?: (hovered: boolean) => void; class?: string } = $props();

	let divEl: HTMLDivElement;

	const onMouseOver = () => {
		onHoverChange?.(true);
	};

	const onMouseOut = () => {
		onHoverChange?.(false);
	};

	const handleTabPress = (e: KeyboardEvent) => {
		if (e.key !== 'Tab') return;

		setTimeout(() => {
			onHoverChange?.(divEl.contains(document.activeElement));
		}, 100);
	};
</script>

<svelte:window onkeydown={handleTabPress} />

<div
	bind:this={divEl}
	role="region"
	onfocus={onMouseOver}
	onblur={onMouseOut}
	onmouseover={onMouseOver}
	onmouseout={onMouseOut}
	class="{className} relative"
>
	{@render children()}
</div>
