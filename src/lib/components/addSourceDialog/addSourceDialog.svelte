<script lang="ts">
	import { z } from 'zod';
	import { Button, Input, Modal } from 'kampsy-ui';

	import { addSource, sources } from '$lib/stores/sources.svelte';

	import { youtubeURLs } from '$lib/utils/youtubeURLs';

	let { open = $bindable(false) }: { open: boolean } = $props();

	let url = $state('');
	let name = $state('');

	const urlRegEx = /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i;
	const urlSchema = z.string().refine((value) => urlRegEx.test(value));

	let urlAlreadyExists = false;

	const onCancel = () => {
		open = false;
	};

	const onSave = () => {
		const embedURL = youtubeURLs.makeEmbedURL(url);
		const urlId = youtubeURLs.extractURLId(url);

		addSource({ url: embedURL, name, id: urlId });

		open = false;
	};

	const isValid = ({ url, name }: { url: string; name: string }) => {
		return urlSchema.safeParse(url).success && name.length > 0;
	};

	$effect(() => {
		const urlId = youtubeURLs.extractURLId(url);
		urlAlreadyExists = sources.list.some((source) => source.id === urlId);
	});

	$effect(() => {
		if (!open) {
			url = '';
			name = '';
		}
	});

	let active = $state(false);
</script>

<div>
	<Modal.Root bind:active={open}>
		<Modal.Content>
			<Modal.Body>
				<Modal.Header>
					<Modal.Title>Agregar Fuente</Modal.Title>
					<Modal.Subtitle
						>Copiá la URL del video de <span class="text-primary-foreground font-semibold"
							>Youtube</span
						>, y escribí el nombre que quieras asignarle.</Modal.Subtitle
					>
				</Modal.Header>
				<div class="flex flex-col gap-8">
					<div class="flex flex-col gap-3">
						<Input
							aria-labelledby="URL"
							label="URL"
							id="url"
							type="text"
							placeholder="https://..."
							bind:value={url}
						/>

						<Input
							aria-labelledby="name"
							label="Name"
							id="name"
							type="text"
							placeholder="Nombre"
							bind:value={name}
						/>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button size="tiny" type="error" onclick={onCancel}>Cancelar</Button>
				<Button size="tiny" type="secondary" onclick={onSave} disabled={!isValid({ url, name })}>
					Guardar
				</Button>
			</Modal.Footer>
		</Modal.Content>
	</Modal.Root>
</div>
