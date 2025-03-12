<script lang="ts">
	import { sources, toggleDeleteMode } from '$lib/stores/sources.svelte';
	import { Tv } from 'lucide-svelte';
	import { Menu } from 'kampsy-ui';

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

<div class="w-full">
	<Menu.Root>
		<Menu.Button>Fuentes</Menu.Button>
		<Menu.Content class="w-[200px]">
			<Menu.Item onClick={() => console.log('One')}>One</Menu.Item>
			<Menu.Item onClick={() => console.log('Two')}>Two</Menu.Item>
			<Menu.Item onClick={() => console.log('Three')}>One</Menu.Item>
			<Menu.Item onClick={() => console.log('Delete')} type="error">Delete</Menu.Item>
		</Menu.Content>
	</Menu.Root>
</div>

<!-- <Menubar.Menu>
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
</Menubar.Menu> -->
