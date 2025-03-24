<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		onHoverChange,
		class: className
	}: { children: Snippet; onHoverChange?: (hovered: boolean) => void; class?: string } = $props();

	const onMouseOver = () => {
		onHoverChange?.(true);
	};

	const onMouseOut = () => {
		onHoverChange?.(false);
	};
</script>

<div
	role="region"
	onfocus={onMouseOver}
	onblur={onMouseOut}
	onmouseover={onMouseOver}
	onmouseout={onMouseOut}
	class="{className} relative"
>
	{@render children()}
</div>
