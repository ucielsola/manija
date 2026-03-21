<script lang="ts">
	import { Plus, Github, LinkedIn, ChevronDown, ChevronRight } from '$lib/components/icons';
	import { app, sourceList, apiSourceList } from '$lib/stores';
	import SourceThumbnail from '$lib/components/SourceThumbnail.svelte';

	let searchUser = $state('');
	let searchApi = $state('');
	let userSourcesOpen = $state(true);
	let apiSourcesOpen = $state(true);
	let addVideoButton: HTMLButtonElement;

	let filteredUserSources = $derived(
		sourceList.sources.filter((source) =>
			source.name.toLowerCase().includes(searchUser.toLowerCase())
		)
	);

	let filteredApiSources = $derived(
		apiSourceList.sources.filter((source) =>
			source.name.toLowerCase().includes(searchApi.toLowerCase())
		)
	);

	$effect(() => {
		addVideoButton?.focus();
	});
</script>

<div class="bg-base-100 h-full w-64 flex flex-col gap-4 overflow-hidden border-r px-3 pt-3">
	<div class="flex w-full grow flex-col gap-3 overflow-y-auto pb-3">
		<!-- Mis Videos Section -->
		<div class="flex flex-col gap-2">
			<button
				class="flex items-center gap-2 text-sm font-semibold text-base-content/80 hover:text-base-content"
				onclick={() => (userSourcesOpen = !userSourcesOpen)}
			>
				{#if userSourcesOpen}
					<ChevronDown className="w-4 h-4" />
				{:else}
					<ChevronRight className="w-4 h-4" />
				{/if}
				Mis Videos
			</button>

			{#if userSourcesOpen}
				<button
					bind:this={addVideoButton}
					class="btn btn-outline btn-sm btn-primary"
					onclick={() => (app.showAddSource = true)}
					aria-label="Add Video"
				>
					<Plus className="w-4 h-4" />
					Agregar Video
				</button>
				{#if sourceList.loading}
					<div class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-base-content/20 bg-base-200/30 p-4">
						<span class="loading loading-spinner loading-md text-primary"></span>
						<span class="text-base-content/60 text-xs font-semibold">Cargando...</span>
					</div>
				{:else if filteredUserSources.length > 0}
					<label class="input input-primary input-sm">
						<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-width="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
						<input type="search" class="grow" placeholder="Buscar..." bind:value={searchUser} />
					</label>
					<div class="flex w-full flex-col gap-2">
						{#each filteredUserSources as source, i (source.id || i)}
							<SourceThumbnail {source} />
						{/each}
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-base-content/20 bg-base-200/30 p-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-base-content/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M6 3 3 6" /><path d="M18 3 21 6" /><path d="M6 21 3 18" /><path d="M18 21 21 18" />
						</svg>
						<span class="text-base-content/60 text-xs font-semibold">Todavía no agregaste videos</span>
					</div>
				{/if}
			{/if}
		</div>

		<!-- Noticias Argentina Section -->
		{#if apiSourceList.sources.length > 0 || apiSourceList.loading}
			<div class="flex flex-col gap-2">
				<button
					class="flex items-center gap-2 text-sm font-semibold text-base-content/80 hover:text-base-content"
					onclick={() => (apiSourcesOpen = !apiSourcesOpen)}
				>
					{#if apiSourcesOpen}
						<ChevronDown className="w-4 h-4" />
					{:else}
						<ChevronRight className="w-4 h-4" />
					{/if}
					Noticias Argentina
				</button>

				{#if apiSourcesOpen}
					{#if apiSourceList.loading}
						<div class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-base-content/20 bg-base-200/30 p-4">
							<span class="loading loading-spinner loading-md text-primary"></span>
							<span class="text-base-content/60 text-xs font-semibold">Cargando...</span>
						</div>
					{:else if filteredApiSources.length > 0}
						<label class="input input-primary input-sm">
							<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-width="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
							<input type="search" class="grow" placeholder="Buscar..." bind:value={searchApi} />
						</label>
						<div class="flex w-full flex-col gap-2">
							{#each filteredApiSources as source, i (source.id || i)}
								<SourceThumbnail {source} list={apiSourceList} />
							{/each}
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-base-content/20 bg-base-200/30 p-4">
							<span class="text-base-content/60 text-xs font-semibold">No hay resultados</span>
						</div>
					{/if}
				{/if}
			</div>
		{/if}
	</div>

	<div class="flex h-8 w-full items-center justify-between gap-2 overflow-hidden border-r border-t p-2">
		<span class="text-xs">
			🧠 By <a
				href="https://ucielsola.dev"
				target="_blank"
				title="UcielSola.dev"
				class="text-primary dark:text-secondary font-medium transition-all hover:font-bold hover:opacity-80">Uciel Sola</a
			>
		</span>

		<div class="flex items-center gap-2">
			<a
				href="https://github.com/ucielsola/manija/tree/main/apps/frontend"
				title="GitHub"
				aria-label="GitHub"
				target="_blank"
				class="text-primary dark:text-secondary cursor-pointer transition-all hover:scale-110 hover:opacity-80"
			>
				<Github className="w-5 h-5" />
			</a>
			<a
				href="https://linkedin.com/in/ucielsola"
				title="LinkedIn"
				aria-label="LinkedIn"
				target="_blank"
				class="text-primary dark:text-secondary cursor-pointer transition-all hover:scale-110 hover:opacity-80"
			>
				<LinkedIn className="w-5 h-5" />
			</a>
		</div>
	</div>
</div>
