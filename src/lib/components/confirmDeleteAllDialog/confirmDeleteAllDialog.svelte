<script lang="ts">
	import { sourceStore } from '$lib/stores/sources.svelte';
	import { Button, Modal } from 'kampsy-ui';

	let { open = $bindable(false) }: { open: boolean } = $props();

	const onCancel = () => {
		open = false;
	};

	const onAction = () => {
		open = false;
		sourceStore.deleteAllSources();
	};
</script>

<div>
	<Modal.Root bind:active={open}>
		<Modal.Content>
			<Modal.Body>
				<Modal.Header>
					<Modal.Title>Querés borrar todas las fuentes?</Modal.Title>
					<Modal.Subtitle>No es posible revertir esta acción.</Modal.Subtitle>
				</Modal.Header>
			</Modal.Body>
			<Modal.Footer>
				<Button onclick={onCancel} type="secondary">Cancelar</Button>
				<Button onclick={onAction}>Continuar</Button>
			</Modal.Footer>
		</Modal.Content>
	</Modal.Root>
</div>
