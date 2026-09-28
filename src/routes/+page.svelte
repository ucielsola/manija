<script lang="ts">
	import { app, userSources, manijaSources, librarySearch } from '$lib/stores';
	import TopBar from '$lib/components/ui/TopBar.svelte';
	import Sidebar from '$lib/components/ui/Sidebar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import AccordionSection from '$lib/components/ui/AccordionSection.svelte';
	import SourceList from '$lib/components/ui/SourceList.svelte';
	import VideoGrid from '$lib/components/ui/VideoGrid.svelte';
	import AddSourceDialog from '$lib/components/ui/AddSourceDialog.svelte';
	import { AlertCircle, Clock3, Radio, RefreshCw, Search, X } from 'lucide-svelte';

	let expandedSection = $state<'noticias' | 'mis-videos' | null>('noticias');
	let mobileMenuOpen = $state(false);

	let apiSources = $derived.by(() => manijaSources.sources);
	let gridSources = $derived.by(() => [...manijaSources.pinned, ...userSources.sources]);
	let gridLoading = $derived.by(() => manijaSources.loading && userSources.sources.length === 0);
	let playingCount = $derived.by(
		() => gridSources.filter((s: { playing?: boolean }) => s.playing).length
	);

	function toggleSection(section: 'noticias' | 'mis-videos') {
		expandedSection = expandedSection === section ? null : section;
		if (section === 'noticias' && !manijaSources.lastFetch) {
			manijaSources.fetchSources();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			app.showAddSource = false;
			mobileMenuOpen = false;
		}
	}

	function toggleApiPin(sourceId: string) {
		manijaSources.toggleSourcePin(sourceId);
		mobileMenuOpen = false;
	}

	function toggleLibraryPin(sourceId: string) {
		userSources.toggleSourcePin(sourceId);
		mobileMenuOpen = false;
	}

	function formatLastUpdate() {
		if (!manijaSources.lastFetch) return 'Todavía sin actualizar';
		return new Intl.DateTimeFormat('es-AR', {
			hour: '2-digit',
			minute: '2-digit'
		}).format(manijaSources.lastFetch);
	}

	function browseLiveChannels() {
		expandedSection = 'noticias';
		librarySearch.clearSearch();

		const shouldOpenDrawer = window.matchMedia('(max-width: 1023px)').matches;
		if (shouldOpenDrawer) mobileMenuOpen = true;

		setTimeout(
			() => {
				const section = document.getElementById('live-channels');
				section?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				section?.querySelector('button')?.focus({ preventScroll: true });
			},
			shouldOpenDrawer ? 250 : 0
		);
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

<svelte:window onkeydown={handleKeydown} />

<div class="bg-surface h-dvh w-screen overflow-hidden">
	<TopBar
		menuOpen={mobileMenuOpen}
		activeStreams={apiSources.length}
		onMenuToggle={() => (mobileMenuOpen = !mobileMenuOpen)}
	/>

	<div class="flex h-dvh pt-14">
		<Sidebar
			activeStreams={playingCount}
			onMuteAll={handleMuteAll}
			open={mobileMenuOpen}
			onClose={() => (mobileMenuOpen = false)}
		>
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
						<div id="live-channels" class="scroll-mt-4">
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
						</div>

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
								<Button variant="primary" onclick={() => (app.showAddSource = true)}>
									+ Agregar Video
								</Button>
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

		<main class="bg-surface-dim min-w-0 flex-1 overflow-y-auto lg:ml-64">
			<div class="mx-auto w-full max-w-[1800px] space-y-5 p-4 sm:space-y-7 sm:p-6 lg:p-8">
				<section
					class="relative overflow-hidden rounded-2xl border border-white/5 bg-[radial-gradient(ellipse_at_top_right,_rgba(126,81,255,0.16),_transparent_48%),linear-gradient(135deg,_#17151e,_#121212_62%)] p-5 sm:p-7"
				>
					<div
						class="bg-primary/5 pointer-events-none absolute -right-16 -bottom-28 size-72 rounded-full blur-3xl"
					></div>
					<div class="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
						<div class="max-w-2xl">
							<div
								class="text-primary mb-3 flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase"
							>
								<Radio size={14} /> Centro de monitoreo
							</div>
							<h1
								class="font-headline text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
							>
								Tu señal en vivo
							</h1>
							<p class="mt-2 max-w-xl text-sm leading-6 text-neutral-400">
								Seguí las transmisiones activas y armá tu propia grilla con tus canales favoritos.
							</p>
						</div>
						<div class="flex flex-wrap items-center gap-2">
							<div
								class="border-secondary/20 bg-secondary/5 flex items-center gap-2 rounded-xl border px-3.5 py-2.5"
							>
								<span
									class="bg-secondary size-2 rounded-full {apiSources.length > 0
										? 'animate-pulse'
										: 'opacity-40'}"
								></span>
								<span class="text-secondary text-xs font-bold">{apiSources.length} en vivo</span>
							</div>
							<div
								class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5"
							>
								<span class="text-sm font-bold text-white">{gridSources.length}</span>
								<span class="text-xs text-neutral-400">en tu grilla</span>
							</div>
						</div>
					</div>
					<div
						class="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4"
					>
						<div class="flex items-center gap-2 text-xs text-neutral-500">
							<Clock3 size={14} />
							<span>Última actualización: {formatLastUpdate()}</span>
						</div>
						<button
							onclick={() => manijaSources.fetchSources()}
							disabled={manijaSources.loading}
							class="text-on-surface-variant hover:text-primary inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/5 disabled:opacity-50"
						>
							<RefreshCw size={14} class={manijaSources.loading ? 'animate-spin' : ''} />
							Actualizar canales
						</button>
					</div>
				</section>

				{#if manijaSources.error}
					<div
						class="border-error/20 bg-error/5 flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
					>
						<div class="text-error flex items-center gap-2 text-sm">
							<AlertCircle size={16} />
							<span>{manijaSources.error}</span>
						</div>
						<button
							onclick={() => manijaSources.fetchSources()}
							class="text-error hover:bg-error/10 rounded-lg px-3 py-2 text-xs font-bold transition-colors"
							>Reintentar</button
						>
					</div>
				{/if}

				<div class="flex items-center justify-between gap-3">
					<div>
						<h2 class="font-headline text-base font-bold text-white sm:text-lg">Reproduciendo</h2>
						<p class="mt-1 text-xs text-neutral-500">
							Canales fijados y videos agregados a tu grilla
						</p>
					</div>
					{#if playingCount > 0}
						<span
							class="text-secondary bg-secondary/5 border-secondary/15 rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase"
							>{playingCount} activos</span
						>
					{/if}
				</div>

				<VideoGrid
					sources={gridSources}
					loading={gridLoading}
					liveSourcesAvailable={apiSources.length}
					onBrowseChannels={browseLiveChannels}
					onClose={(id) => deleteSource(id)}
				/>
			</div>
		</main>
	</div>
</div>

<AddSourceDialog />
