<script lang="ts">
	import { z } from 'zod';

	import { Input } from '$lib/components/common';
	import { Remove, Save } from '$lib/components/icons';

	import { youtubeURLs } from '$lib/utils/youtubeURLs';
	import { app, sourceList } from '$lib/stores';

	const urlRegEx = /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i;
	const urlSchema = z.string().refine((value) => urlRegEx.test(value));

	let open = $derived(app.showAddSource);
	let url = $state('');
	let name = $state('');
	let sources = $derived(sourceList.sources);
	let urlAlreadyExists = $derived(
		!!sources.find((source) => source.id === youtubeURLs.extractURLId(url))
	);
	let isValid = $derived(urlSchema.safeParse(url).success && name.length > 0);
	let disableSubmit = $derived(urlAlreadyExists || !isValid);

	const onCancel = () => {
		app.showAddSource = false;
	};

	const onSave = () => {
		sourceList.addSource({ url, name });

		app.showAddSource = false;
	};

	$effect(() => {
		if (!open) {
			url = '';
			name = '';
		}
	});
</script>

<dialog class={`modal ${open ? 'modal-open' : ''}`}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Agregar Video</h3>
		<p class="py-4 text-sm">
			Copiá la URL del video de Youtube, y escribí el nombre que quieras asignarle.
		</p>

		<div class="flex flex-col gap-4 w-full">
			<div>
				<Input
					labelledby="url"
					label="URL"
					id="url"
					type="text"
					placeholder="https://..."
					bind:value={url}
				/>

				<Input
					labelledby="name"
					label="Name"
					id="name"
					type="text"
					placeholder="Nombre"
					bind:value={name}
				/>
			</div>

			<div class="flex items-center gap-4 w-full justify-end">
				<button class="btn btn-outline btn-sm btn-error" onclick={onCancel}>
					<Remove className="w-4 h-4" />
					Cancelar
				</button>

				<button class="btn btn-sm btn-primary" disabled={disableSubmit} onclick={onSave}>
					<Save className="w-4 h-4" />
					Guardar
				</button>
			</div>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop" onsubmit={onCancel}>
		<button>close</button>
	</form>
</dialog>
