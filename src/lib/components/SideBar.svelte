<script lang="ts">
	import { app, sourceList } from '$lib/stores';
	import { Plus, Github, LinkedIn } from '$lib/components/icons';
	import SourceThumbnail from '$lib/components/SourceThumbnail.svelte';

	let search = $state('');
	let filteredSources = $derived(sourceList.sources.filter(source => source.name.toLowerCase().includes(search.toLowerCase())));
	let isCollapsed = $derived(app.sideBarCollapsed);
	let translate = $derived(isCollapsed ? 'translate-x-[-100%]' : 'translate-x-0');
	let width = $derived(isCollapsed ? 'w-0' : 'w-64');
	let addVideoButton: HTMLButtonElement;

	$effect(() => {
		addVideoButton?.focus();
	});
</script>

<div
	class={`relative h-full ${width} transition-width flex flex-col overflow-visible duration-200`}
>
	<div class={`grow overflow-hidden transition-transform duration-200 ${translate}`}>
		<div
			class={`bg-base-100 relative flex h-full w-64 flex-col gap-4 overflow-hidden border-r px-3 pt-3`}
		>
			<button
				bind:this={addVideoButton}
				class="btn btn-outline btn-wide btn-sm btn-primary mt-8"
				onclick={() => (app.showAddSource = true)}
				aria-label="Add Video"
			>
				<Plus className="w-4 h-4" />
				Agregar Video
			</button>

			<label class="input input-primary">
				<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
				<input type="search" class="grow" placeholder="Search" bind:value={search} />
			  </label>

			<div class="flex w-full grow flex-col gap-3 overflow-y-auto pb-3">
				{#each filteredSources as source, i (source.id)}
					<SourceThumbnail {source} />
				{:else}
					<div class="flex items-center justify-center rounded-md border border-dashed p-6">
						<span class="text-primary-foreground text-xs font-semibold">
							Todavía no agregaste videos
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div
		class={`flex h-8 w-full items-center justify-between gap-2 overflow-hidden border-r border-t p-2 transition-transform duration-200 ${translate}`}
	>
		<span class="text-xs">
			🧠 By <a
				href="https://ucielsola.dev"
				target="_blank"
				title="UcielSola.dev"
				class="text-primary dark:text-secondary font-medium hover:font-bold">Uciel Sola</a
			>
		</span>

		<div class="flex items-center gap-2">
			<a
				href="https://github.com/ucielsola/manija/tree/main/apps/frontend"
				title="GitHub"
				aria-label="GitHub"
				target="_blank"
				class="text-primary dark:text-secondary cursor-pointer transition-transform hover:scale-105"
			>
				<Github className="w-5 h-5" />
			</a>
			<a
				href="https://linkedin.com/in/ucielsola"
				title="LinkedIn"
				aria-label="LinkedIn"
				target="_blank"
				class="text-primary dark:text-secondary cursor-pointer transition-transform hover:scale-105"
			>
				<LinkedIn className="w-5 h-5" />
			</a>
		</div>
	</div>
</div>
