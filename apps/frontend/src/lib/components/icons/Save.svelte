<script lang="ts">
	let { className }: { className?: string } = $props();
</script>

<svg
	role="img"
	class={className || 'h-full w-full'}
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<g
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		><path d="M6 4h10l4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" /><path
			d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0-4 0m4-10v4H8V4"
		/></g
	>
</svg>
