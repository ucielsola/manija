<script lang="ts">
	import '../app.css';

	import { inject as injectVercelAnalytics } from '@vercel/analytics';

	import { app, userSources, manijaSources } from '$lib/stores';

	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	$effect(() => {
		injectVercelAnalytics();
		setTimeout(() => {
			app.initStorage();
			userSources.initStorage();
			manijaSources.init();
		}, 800);
	});
</script>

<svelte:head>
	<title>Manija TV</title>
</svelte:head>

<div class="h-screen w-screen">
	{@render children()}
</div>
