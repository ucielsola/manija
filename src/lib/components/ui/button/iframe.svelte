<script lang="ts">
	let { url }: { url: string } = $props();

	$effect(() => {
		console.log(url);
	});
</script>

{#if url}
	<iframe
		width="560"
		height="315"
		src={url}
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
{/if}
