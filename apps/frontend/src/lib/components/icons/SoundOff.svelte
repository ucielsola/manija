<script lang="ts">
	let { className }: { className?: string } = $props();
</script>

<svg
	role="img"
	class={className || 'h-full w-full'}
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M3 17a3 3 0 1 0 6 0a3 3 0 1 0-6 0m11.42-2.55a3 3 0 1 0 4.138 4.119M9 17V9m0-4V4h10v11m-7-7h7M3 3l18 18"
	/>
</svg>
