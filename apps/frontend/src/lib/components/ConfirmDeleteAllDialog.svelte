<script lang="ts">
	import { app, sourceList } from '$lib/stores';
	import { ChevronLeft, Remove } from '$lib/components/icons';
	import FocusTrap from './common/FocusTrap.svelte';

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
	{#if open}
		<div class="modal-box">
			<FocusTrap>
				<h3 class="text-lg font-bold">Reiniciar</h3>
				<p class="py-4 text-sm">
					¿Estás seguro de que quieres reiniciar Manija TV? Se borrarán todos los videos.
				</p>

				<div class="flex w-full flex-col gap-4">
					<div class="flex w-full items-center justify-end gap-4">
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
			</FocusTrap>
		</div>
	{/if}

	<form method="dialog" class="modal-backdrop" onsubmit={onCancel}>
		<button aria-label="Close">close</button>
	</form>
</dialog>
