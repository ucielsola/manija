<script lang="ts">
	import { userSources, manijaSources, librarySearch } from '$lib/stores';
	import TopBar from '$lib/components/ui/TopBar.svelte';
	import Sidebar from '$lib/components/ui/Sidebar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import AccordionSection from '$lib/components/ui/AccordionSection.svelte';
	import SourceList from '$lib/components/ui/SourceList.svelte';
	import VideoGrid from '$lib/components/ui/VideoGrid.svelte';
	import { Search, X } from 'lucide-svelte';

	let expandedSection = $state<'noticias' | 'mis-videos' | null>('noticias');

	let apiSources = $derived.by(() => manijaSources.sources);
	let gridSources = $derived.by(() => [...manijaSources.pinned, ...userSources.sources]);
	let gridLoading = $derived.by(() => manijaSources.loading && userSources.sources.length === 0);
	let playingCount = $derived.by(() => gridSources.filter((s) => s.playing).length);

	function toggleSection(section: 'noticias' | 'mis-videos') {
		expandedSection = expandedSection === section ? null : section;
		if (section === 'noticias' && !manijaSources.lastFetch) {
			manijaSources.fetchSources();
		}
	}

	function toggleApiPin(sourceId: string) {
		manijaSources.toggleSourcePin(sourceId);
	}

	function toggleLibraryPin(sourceId: string) {
		userSources.toggleSourcePin(sourceId);
	}

	function isApiSourcePinned(sourceId: string): boolean {
		return manijaSources.pinned.some((s) => s.id === sourceId);
	}

	function deleteSource(sourceId: string) {
		const apiSource = manijaSources.pinned.find((s) => s.id === sourceId);
		const librarySource = userSources.sources.find((s) => s.id === sourceId);

		if (apiSource) {
			manijaSources.toggleSourcePin(sourceId);
		}
		if (librarySource) {
			userSources.deleteSource(librarySource);
		}
	}

	function handleMuteAll() {
		userSources.muteAll();
		manijaSources.muteAll();
	}

	function toggleSearchPin(sourceId: string) {
		if (manijaSources.sources.some((s) => s.id === sourceId)) {
			manijaSources.toggleSourcePin(sourceId);
		} else {
			userSources.toggleSourcePin(sourceId);
		}
	}

	function isSearchResultPinned(sourceId: string): boolean {
		return (
			manijaSources.pinned.some((s) => s.id === sourceId) ||
			userSources.pinned.some((s) => s.id === sourceId)
		);
	}
</script>

<svelte:head>
	<title>Manija TV</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="bg-surface h-screen w-screen overflow-hidden">
	<TopBar />

	<div class="flex h-screen pt-14">
		<Sidebar activeStreams={playingCount} onMuteAll={handleMuteAll}>
			<div>
				<div class="mb-2 flex items-center justify-between px-3">
					<span class="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
						Biblioteca
					</span>
				</div>

				<div class="px-3 pb-3">
					<div class="relative">
						<Search size={14} class="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
						<input
							bind:value={librarySearch.searchTerm}
							type="text"
							placeholder="Buscar videos..."
							class="bg-surface-container-low text-on-surface focus:ring-primary/50 w-full rounded-md py-2 pr-8 pl-9 text-xs placeholder:text-neutral-500 focus:ring-2 focus:outline-none"
						/>
						{#if librarySearch.hasSearch}
							<button
								onclick={() => librarySearch.clearSearch()}
								class="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-neutral-200"
							>
								<X size={14} />
							</button>
						{/if}
					</div>
				</div>

				{#if !librarySearch.hasSearch}
					<div class="space-y-1">
						<AccordionSection
							title="Noticias Argentina"
							expanded={expandedSection === 'noticias'}
							onToggle={() => toggleSection('noticias')}
						>
							<SourceList
								sources={apiSources}
								loading={manijaSources.loading}
								emptyMessage="No hay canales disponibles"
								onPinToggle={toggleApiPin}
								isPinned={isApiSourcePinned}
								showPinButton
							/>
						</AccordionSection>

						<AccordionSection
							title="Mis Videos"
							expanded={expandedSection === 'mis-videos'}
							onToggle={() => toggleSection('mis-videos')}
						>
							<SourceList
								sources={userSources.sources}
								loading={userSources.loading}
								emptyMessage="No tienes videos guardados"
								onPinToggle={toggleLibraryPin}
							>
								<Button variant="primary">+ Agregar Video</Button>
							</SourceList>
						</AccordionSection>
					</div>
				{:else}
					<SourceList
						sources={librarySearch.filteredSources}
						loading={false}
						emptyMessage="No se encontraron resultados"
						onPinToggle={toggleSearchPin}
						isPinned={isSearchResultPinned}
						showPinButton
					/>
				{/if}
			</div>
		</Sidebar>

		<main class="bg-surface-dim ml-64 flex-1 overflow-y-auto p-4">
			<VideoGrid sources={gridSources} loading={gridLoading} onClose={(id) => deleteSource(id)} />
		</main>
	</div>
</div>
