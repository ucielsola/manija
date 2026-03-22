<script lang="ts">
	import { z } from 'zod';
	import { X, Loader2, Save } from 'lucide-svelte';
	import { app, userSources } from '$lib/stores';
	import { youtubeURLs } from '$lib/utils/youtubeURLs';
	import { getYoutubeUrlFromClipboard } from '$lib/utils/clipboard';

	const urlRegEx = /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i;
	const urlSchema = z.string().refine((value) => urlRegEx.test(value));

	let open = $derived(app.showAddSource);
	let url = $state('');
	let name = $state('');
	let loading = $state(false);
	let sources = $derived(userSources.sources);
	let urlAlreadyExists = $derived(
		!!sources.find((source: { id: string }) => source.id === youtubeURLs.extractURLId(url))
	);
	let isValid = $derived(urlSchema.safeParse(url).success && name.length > 0);
	let disableSubmit = $derived(urlAlreadyExists || !isValid || loading);
	let urlInput: HTMLInputElement;

	function onCancel() {
		app.showAddSource = false;
	}

	function onSave() {
		userSources.addSource({ url, name });
		app.showAddSource = false;
	}

	async function onOpen() {
		try {
			loading = true;
			const youtubeUrl = await getYoutubeUrlFromClipboard();

			if (youtubeUrl) {
				url = youtubeUrl;
				name = await youtubeURLs.getVideoName(url);
			}
		} catch (error) {
			console.error('Error al abrir diálogo:', error);
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (!open) {
			url = '';
			name = '';
		} else {
			onOpen();
		}
	});

	$effect(() => {
		if (open && urlInput) {
			urlInput.focus();
		}
	});
</script>

{#if open}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
		role="presentation"
		onclick={onCancel}
	>
		<div
			class="glass-blight bg-surface-container relative w-full max-w-md rounded-lg p-6 shadow-2xl"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') onCancel();
			}}
			role="dialog"
			aria-modal="true"
			aria-labelledby="dialog-title"
		>
			<button
				onclick={onCancel}
				class="hover:text-on-surface absolute top-4 right-4 text-neutral-500 transition-colors"
				aria-label="Close"
			>
				<X size={20} />
			</button>

			<h3 id="dialog-title" class="font-headline text-primary mb-2 text-xl font-black">
				Agregar Video
			</h3>
			<p class="text-on-surface-variant mb-6 text-sm">
				Copiá la URL del video de YouTube, y escribí el nombre que quieras asignarle.
			</p>

			{#if loading}
				<div class="flex items-center justify-center py-8">
					<Loader2 class="text-primary animate-spin" size={24} />
				</div>
			{:else}
				<form onsubmit={(e) => e.preventDefault()} class="flex flex-col gap-4">
					<div>
						<label for="url" class="text-on-surface-variant text-xs font-bold uppercase">
							URL
						</label>
						<input
							bind:this={urlInput}
							id="url"
							type="text"
							placeholder="https://youtube.com/watch?v=..."
							bind:value={url}
							class="bg-surface-container-low border-surface-variant text-on-surface focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border px-3 py-2 text-sm placeholder:text-neutral-500 focus:ring-1 focus:outline-none"
						/>
						{#if urlAlreadyExists}
							<p class="text-error mt-1 text-xs">Este video ya está en tu biblioteca</p>
						{/if}
					</div>

					<div>
						<label for="name" class="text-on-surface-variant text-xs font-bold uppercase">
							Nombre
						</label>
						<input
							id="name"
							type="text"
							placeholder="Nombre del video"
							bind:value={name}
							class="bg-surface-container-low border-surface-variant text-on-surface focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border px-3 py-2 text-sm placeholder:text-neutral-500 focus:ring-1 focus:outline-none"
						/>
					</div>

					<div class="flex items-center justify-end gap-3 pt-2">
						<button
							type="button"
							class="hover:text-on-surface rounded-md px-4 py-2 text-xs font-bold text-neutral-400 uppercase transition-colors"
							onclick={onCancel}
						>
							Cancelar
						</button>

						<button
							type="button"
							class="btn-gradient text-on-primary flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
							disabled={disableSubmit}
							onclick={onSave}
						>
							<Save size={14} />
							Guardar
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}
