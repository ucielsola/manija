<script lang="ts">
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { deleteAllSources } from "$lib/stores/sources.svelte";

    let { open = $bindable(false) }: { open: boolean} = $props();

    const onCancel = () => {
        open = false;
    };

    const onAction = () => {
        open = false;
        deleteAllSources()
    };
  </script>
   
  <AlertDialog.Root bind:open>
    <AlertDialog.Trigger />
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Querés borrar todas las fuentes?</AlertDialog.Title>
        <AlertDialog.Description>
          No es posible revertir esta acción.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel onclick={onCancel}>Cancelar</AlertDialog.Cancel>
        <AlertDialog.Action onclick={onAction}>Continuar</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>