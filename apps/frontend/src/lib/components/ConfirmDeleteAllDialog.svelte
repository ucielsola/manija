<script lang="ts">
	import { app, sourceList } from '$lib/stores';
	import { ChevronLeft, Remove } from '$lib/components/icons';

	let open = $derived(app.showDeleteAll);

	const onCancel = () => {
		app.showDeleteAll = false;
	};

	const onConfirm = () => {
		sourceList.reset();
		app.showDeleteAll = false;
	};
</script>

<dialog class={`modal ${open ? 'modal-open' : ''}`}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Reiniciar</h3>
		<p class="py-4 text-sm">
			¿Estás seguro de que quieres reiniciar Manija TV? Se borrarán todos los videos.
		</p>

		<div class="flex flex-col gap-4 w-full">
			<div class="flex items-center gap-4 w-full justify-end">
				<button class="btn btn-outline btn-sm" aria-label="Cancel" onclick={onCancel}>
					<ChevronLeft className="w-4 h-4" />
					Cancelar
				</button>
				<button class="btn btn-sm btn-error" aria-label="Confirm" onclick={onConfirm}>
					<Remove className="w-4 h-4" />
					Si, borrar todo
				</button>
			</div>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop" onsubmit={onCancel}>
		<button aria-label="Close">close</button>
	</form>
</dialog>
