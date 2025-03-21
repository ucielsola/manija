<script lang="ts">
	import { toastStore } from '$lib/stores';
	import type { Toast } from '$lib/types/Toast';

	let presenting = $derived(toastStore.presenting);
</script>

<div class="toast">
	{#each presenting as toast}
		{@render Toast(toast)}
	{/each}
</div>

{#snippet Toast(t: Toast)}
	<div class="alert {`alert-${t.type}`}">
		<span>{t.text}</span>
	</div>
{/snippet}
