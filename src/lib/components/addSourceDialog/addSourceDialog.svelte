<script lang="ts">
	import { z } from 'zod';
	import * as Dialog from '$lib/components/ui/dialog';

	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	import { addSource, sources } from '$lib/stores/sources.svelte';

	import { youtubeURLs } from '$lib/utils/youtubeURLs';

	type EventHandler = () => void;

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
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger />
	<Dialog.Content class="bg-primary">
		<Dialog.Header>
			<Dialog.Title class="text-primary-foreground">Agregar Fuente</Dialog.Title>
			<Dialog.Description class="text-primary-foreground/70">
				Copiá la URL del video de <span class="text-primary-foreground font-semibold">Youtube</span>, y escribí el nombre que quieras asignarle.
			</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-8">
			<div class="flex flex-col gap-3">
				<div class="flex flex-col gap-1">
					<Label class="text-primary-foreground" for="url">URL</Label>
					<Input id="url" type="text" placeholder="https://..." bind:value={url} />
				</div>

				<div class="flex flex-col gap-1">
					<Label class="text-primary-foreground" for="name">Nombre</Label>
					<Input id="name" type="text" placeholder="Nombre" bind:value={name} />
				</div>
			</div>
			<div class="flex items-center justify-between">
				<Button variant="destructive" onclick={onCancel}>Cancelar</Button>
				<Button variant="outline" onclick={onSave} disabled={!isValid({ url, name })}>
					Guardar
				</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
