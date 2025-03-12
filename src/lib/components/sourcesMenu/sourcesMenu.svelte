<script lang="ts">
	import { sourceStore } from '$lib/stores/sources.svelte';
	import { Menu } from 'kampsy-ui';

	type Props = {
		onAddSource: () => void;
		onDeleteAll: () => void;
	};

	let { onAddSource, onDeleteAll }: Props = $props();

	const { toggleDeleteMode } = sourceStore;

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

<div class="w-full">
	<Menu.Root>
		<Menu.Button>Fuentes</Menu.Button>
		<Menu.Content class="w-[200px]">
			{#each items as item}
				<Menu.Item>{item.label}</Menu.Item>
			{/each}
		</Menu.Content>
	</Menu.Root>
</div>