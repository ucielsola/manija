<script lang="ts">
	import { toastStore } from '$lib/stores';
	import type { Toast } from '$lib/types/Toast';
	import { Check, Trash, Refresh } from '$lib/components/icons';

	let presenting = $derived(toastStore.presenting);

	const getIcon = (type: Toast['type']) => {
		switch (type) {
			case 'success':
				return Check;
			case 'error':
				return Trash;
			case 'info':
				return Refresh;
			default:
				return Check;
		}
	};
</script>

<div class="toast">
	{#each presenting as toast}
		{@render Toast(toast)}
	{/each}
</div>

{#snippet Toast(t: Toast)}
	{@const Icon = getIcon(t.type)}
	<div class={`alert alert-${t.type} gap-2`}>
		<Icon className="h-5 w-5" />
		<span>{t.text}</span>
	</div>
{/snippet}
