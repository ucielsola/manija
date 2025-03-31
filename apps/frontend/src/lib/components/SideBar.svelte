<script lang="ts">
	import { app, sourceList } from '$lib/stores';
	import { Plus, Github, LinkedIn } from '$lib/components/icons';
	import SourceThumbnail from '$lib/components/SourceThumbnail.svelte';

	let isCollapsed = $derived(app.sideBarCollapsed);
	let translate = $derived(isCollapsed ? 'translate-x-[-100%]' : 'translate-x-0');
	let width = $derived(isCollapsed ? 'w-0' : 'w-64');
	let addVideoButton: HTMLButtonElement;

	$effect(() => {
		addVideoButton?.focus();
	});

	const test = async () => {
		const testi = await fetch('https://manija-sources.up.railway.app/live');
		const data = await testi.json();
		console.log(data);
	};
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

			<button
				onclick={test}
				class="btn btn-outline btn-wide btn-sm btn-primary mt-8"
				aria-label="Add Video"
			>
				<Plus className="w-4 h-4" />
				Test
			</button>

			<div class="flex w-full grow flex-col gap-3 overflow-y-auto pb-3">
				{#each sourceList.sources as source, i (source.id)}
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
