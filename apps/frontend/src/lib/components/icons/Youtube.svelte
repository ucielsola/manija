<script lang="ts">
	let { className } : { className?: string } = $props()
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
		><path d="M2 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" /><path
			d="m10 9l5 3l-5 3z"
		/></g
	>
</svg>
