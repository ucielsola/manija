<script lang="ts">
	import { Tv } from '$lib/components/icons';
	import { app } from '$lib/stores';

	const handleNo = () => {
		app.showIntro = false;
	};

	const handleYes = () => {
		navigator.clipboard.read();
	};

	$effect(() => {
		const ua = navigator.userAgent;

		if (ua.includes('Chrome')) {
			app.checkClipboardAccess();
		} else {
			handleNo();
		}
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<Tv className="h-48 w-48 text-primary animate-pulse" />

	{#if !app.hasClipboardAccess}
		<div class="flex flex-col gap-2 text-center">
			<span class="text-primary-foreground text-2xl font-semibold">¡Bienvenido a Manija TV!</span>

			<div class="text-primary-foreground flex flex-col gap-2">
				<span> Con tu permiso, puedo leer lo que copiaste y ayudarte a arrancar más rápido. </span>
				<span>
					Por ejemplo, si copiaste una URL de YouTube, puedo detectarla y traer el nombre del video
					automáticamente.
				</span>
				<span class="mt-2 font-medium">
					No guardo nada, y solo lo uso para simplificarte las cosas. ¿Me das acceso?
				</span>
			</div>

			<div class="mt-4 flex w-full items-center justify-center gap-4">
				<button class="btn btn-error btn-sm btn-outline" onclick={handleNo}>No me interesa</button>
				<button class="btn btn-primary btn-sm btn-wide" onclick={handleYes}>Permitir</button>
			</div>
		</div>
	{/if}
</div>
