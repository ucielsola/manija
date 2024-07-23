<script lang="ts">
	import * as Menubar from '$lib/components/ui/menubar';
	import { sources, toggleDeleteMode } from '$lib/stores/sources.svelte';
	import { Tv } from 'lucide-svelte';

	type Props = {
		onAddSource: () => void;
		onDeleteAll: () => void;
	};

	let { onAddSource, onDeleteAll }: Props = $props();

	const items: {
		label: string;
		url?: string;
		shortcut?: string;
		href?: string;
		isDataDeleteSource?: boolean;
		handler?: () => void;
	}[] = [
		{
			label: 'Agregar fuente',
			handler: onAddSource
		},
		{ label: 'Borrar fuentes', isDataDeleteSource: true, handler: toggleDeleteMode },
		{ label: 'Borrar todo', handler: onDeleteAll }
	];
</script>

<Menubar.Menu>
	<Menubar.Trigger class="cursor-pointer">Fuentes</Menubar.Trigger>
	<Menubar.Content>
		{#each items as item, index (index)}
			{@const isLast = index === items.length - 1}
			<Menubar.Item
				class="cursor-pointer"
				href={item.href}
				onclick={() => item.handler && item.handler()}
				data-delete-source={item.isDataDeleteSource}
				disabled={sources.isDeleting}
			>
				{item.label}
				{#if item.shortcut}
					<Menubar.Shortcut>{item.shortcut}</Menubar.Shortcut>
				{/if}
			</Menubar.Item>
			{#if !isLast}
				<Menubar.Separator />
			{/if}
		{/each}
	</Menubar.Content>
</Menubar.Menu>
