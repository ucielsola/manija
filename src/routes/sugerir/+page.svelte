<script lang="ts">
	import { ArrowLeft, CheckCircle2, LoaderCircle, Send, Tv } from 'lucide-svelte';

	let message = $state('');
	let website = $state('');
	let busy = $state(false);
	let error = $state('');
	let sent = $state(false);

	async function submitSuggestion(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		error = '';
		try {
			const response = await fetch('/api/suggestions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message, website })
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error ?? 'No se pudo enviar la sugerencia.');
			sent = true;
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'No se pudo enviar la sugerencia.';
		} finally {
			busy = false;
		}
	}
</script>

<svelte:head>
	<title>Sugerir un canal · Manija TV</title>
	<meta name="description" content="Sugerí un canal para sumar a Manija TV." />
</svelte:head>

<main class="bg-surface text-on-surface flex min-h-screen flex-col px-4 py-6 sm:px-8 sm:py-10">
	<div class="mx-auto flex w-full max-w-xl flex-1 flex-col">
		<header class="mb-12 flex items-center justify-between">
			<a
				href="/"
				class="text-on-surface-variant hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
			>
				<ArrowLeft size={16} /> Volver a Manija TV
			</a>
			<a href="/" aria-label="Manija TV" class="text-primary"><Tv size={23} /></a>
		</header>

		<section
			class="border-outline-variant/25 bg-surface-container my-auto rounded-2xl border p-6 sm:p-9"
		>
			{#if sent}
				<div class="py-5 text-center">
					<div
						class="bg-secondary/10 text-secondary mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl"
					>
						<CheckCircle2 size={27} />
					</div>
					<h1 class="font-headline text-2xl font-extrabold">¡Gracias por la sugerencia!</h1>
					<p class="text-on-surface-variant mt-3 text-sm leading-6">
						La recibimos. Vamos a tenerla en cuenta para Manija TV.
					</p>
					<button
						type="button"
						onclick={() => {
							message = '';
							sent = false;
						}}
						class="text-primary mt-6 text-sm font-semibold hover:underline"
					>
						Sugerir otro canal
					</button>
				</div>
			{:else}
				<p class="text-primary mb-2 text-[10px] font-bold tracking-[0.22em] uppercase">Manija TV</p>
				<h1 class="font-headline text-2xl font-extrabold sm:text-3xl">
					¿Qué canal te gustaría ver?
				</h1>
				<p class="text-on-surface-variant mt-3 mb-7 text-sm leading-6">
					Contanos el nombre o pegá un link. Leemos todas las sugerencias.
				</p>
				<form onsubmit={submitSuggestion} class="space-y-4">
					<label
						class="text-on-surface-variant block text-xs font-semibold"
						for="suggestion-message"
					>
						Tu sugerencia
					</label>
					<textarea
						id="suggestion-message"
						bind:value={message}
						maxlength="500"
						rows="5"
						required
						placeholder="Por ejemplo: me gustaría ver el canal de..."
						class="bg-surface-container-low border-outline-variant/40 focus:border-primary w-full resize-y rounded-lg border px-4 py-3 text-sm leading-6 transition-colors outline-none"
					></textarea>
					<div class="-mt-3 text-right text-xs text-neutral-500">{message.length}/500</div>
					<div
						aria-hidden="true"
						class="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
					>
						<label for="suggestion-website">No completar</label>
						<input id="suggestion-website" bind:value={website} tabindex="-1" autocomplete="off" />
					</div>
					{#if error}<p class="text-error text-sm" role="alert">{error}</p>{/if}
					<button
						type="submit"
						disabled={busy || !message.trim()}
						class="btn-gradient text-on-primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold tracking-widest uppercase disabled:opacity-60"
					>
						{#if busy}<LoaderCircle size={15} class="animate-spin" />{:else}<Send size={15} />{/if}
						Enviar sugerencia
					</button>
				</form>
			{/if}
		</section>
	</div>
</main>
