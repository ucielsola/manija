<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	type Props = {
		tooltipText: string;
		children: Snippet;
	};

	let { tooltipText, children }: Props = $props();
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{@render children()}
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>{tooltipText}</p>
	</Tooltip.Content>
</Tooltip.Root>
