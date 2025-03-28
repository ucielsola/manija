<script lang="ts">
	import { Input } from '$lib/components/common';
	import { Remove, Save } from '$lib/components/icons';
	import { app, sourceList } from '$lib/stores';

	let open = $derived(app.renamingSourceId !== null);
	let name = $state(sourceList.sources.find((source) => source.id === app.renamingSourceId)?.name ?? '');

	let isValid = $derived(name.length > 0);

	const onCancel = () => {
		app.renamingSourceId = null;
	};

	const onSave = () => {
		sourceList.renameSource(app.renamingSourceId!, name);

		app.renamingSourceId = null;
	};

	$effect(() => {
		if (!open) {
			name = '';
		}
	});
</script>

<dialog class={`modal ${open ? 'modal-open' : ''}`}>
	{#if open}
		<div class="modal-box">
			<h3 class="text-lg font-bold">Renombrar Video</h3>
			<p class="py-4 text-sm">
				Escribí el nombre que quieras asignarle.
			</p>

			<div class="flex w-full flex-col gap-4">
				<div>
					<Input
						labelledby="name"
						label="Name"
						id="name"
						type="text"
						placeholder="Nombre"
						bind:value={name}
					/>
				</div>

				<div class="flex w-full items-center justify-end gap-4">
					<button class="btn btn-outline btn-sm btn-error" aria-label="Cancel" onclick={onCancel}>
						<Remove className="w-4 h-4" />
						Cancelar
					</button>

					<button
						class="btn btn-sm btn-primary"
						aria-label="Save"
						disabled={!isValid}
						onclick={onSave}
					>
						<Save className="w-4 h-4" />
						Guardar
					</button>
				</div>
			</div>
		</div>
	{/if}

	<form method="dialog" class="modal-backdrop" onsubmit={onCancel}>
		<button aria-label="Close">close</button>
	</form>
</dialog>
