<script lang="ts">
	let { className } : { className?: string } = $props()
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
		d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm13-6l-4 4l-4-4"
	/>
</svg>
