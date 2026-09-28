<script lang="ts">
	import {
		ArrowLeft,
		Archive,
		Check,
		ExternalLink,
		Inbox,
		LoaderCircle,
		LogOut,
		Plus,
		Radio,
		RefreshCw,
		ShieldCheck,
		Trash2,
		X
	} from 'lucide-svelte';

	interface Channel {
		id: number;
		handle: string;
		status: 'live' | 'offline';
		live_url?: string;
		liveUrl?: string;
		updated_at?: number;
		updatedAt?: number;
	}

	interface Suggestion {
		id: number;
		message: string;
		status: 'pending' | 'reviewed' | 'dismissed';
		created_at: number;
	}

	let { data } = $props();
	let authenticated = $state(false);
	let channels = $state<Channel[]>([]);
	let suggestions = $state<Suggestion[]>([]);
	let total = $state(0);
	let live = $state(0);
	let password = $state('');
	let handle = $state('');
	let busy = $state(false);
	let error = $state('');
	let notice = $state('');
	let channelToDelete = $state<Channel | null>(null);
	let suggestionsLoading = $state(false);
	let suggestionsError = $state('');
	let suggestionBusyId = $state<number | null>(null);

	$effect(() => {
		authenticated = data.authenticated;
		channels = data.channels;
		total = data.total;
		live = data.live;
		if (data.authenticated) void refreshSuggestions();
	});

	async function refreshSuggestions() {
		suggestionsLoading = true;
		suggestionsError = '';
		try {
			const response = await fetch('/api/admin/suggestions');
			const result = await response.json();
			if (!response.ok) throw new Error(result.error ?? 'No se pudieron cargar las sugerencias.');
			suggestions = result.suggestions ?? [];
		} catch (cause) {
			suggestionsError =
				cause instanceof Error ? cause.message : 'No se pudieron cargar las sugerencias.';
		} finally {
			suggestionsLoading = false;
		}
	}

	async function setSuggestionStatus(suggestion: Suggestion, status: Suggestion['status']) {
		suggestionBusyId = suggestion.id;
		suggestionsError = '';
		try {
			const response = await fetch(`/api/admin/suggestions/${suggestion.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status })
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error ?? 'No se pudo actualizar la sugerencia.');
			suggestions = suggestions.map((item) =>
				item.id === suggestion.id ? { ...item, status: result.suggestion.status } : item
			);
		} catch (cause) {
			suggestionsError =
				cause instanceof Error ? cause.message : 'No se pudo actualizar la sugerencia.';
		} finally {
			suggestionBusyId = null;
		}
	}

	function formatSuggestionDate(timestamp: number) {
		return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(
			new Date(timestamp * 1000)
		);
	}

	async function refreshChannels() {
		error = '';
		try {
			const response = await fetch('/api/streams');
			if (!response.ok) throw new Error('No se pudo cargar la lista de canales');
			const result = await response.json();
			channels = result.channels ?? [];
			total = result.total ?? 0;
			live = result.live ?? 0;
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'No se pudo cargar la lista de canales';
		}
	}

	async function login(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		error = '';
		try {
			const response = await fetch('/api/admin/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password })
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error ?? 'No se pudo iniciar sesión');
			authenticated = true;
			password = '';
			await refreshChannels();
			await refreshSuggestions();
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'No se pudo iniciar sesión';
		} finally {
			busy = false;
		}
	}

	async function addChannel(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		error = '';
		notice = '';
		try {
			const response = await fetch('/api/admin/channels', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ handle })
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error ?? 'No se pudo agregar el canal');
			handle = '';
			notice = 'Canal agregado y consultado.';
			await refreshChannels();
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'No se pudo agregar el canal';
		} finally {
			busy = false;
		}
	}

	async function removeChannel() {
		if (!channelToDelete) return;
		busy = true;
		error = '';
		notice = '';
		try {
			const response = await fetch(`/api/admin/channels/${channelToDelete.id}`, {
				method: 'DELETE'
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error ?? 'No se pudo quitar el canal');
			notice = `${channelToDelete.handle} ya no se monitorea.`;
			channelToDelete = null;
			await refreshChannels();
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'No se pudo quitar el canal';
		} finally {
			busy = false;
		}
	}

	async function logout() {
		busy = true;
		await fetch('/api/admin/logout', { method: 'POST' });
		authenticated = false;
		channels = [];
		suggestions = [];
		total = 0;
		live = 0;
		busy = false;
	}

	function youtubeUrl(channel: Channel) {
		return (
			channel.live_url ||
			channel.liveUrl ||
			`https://www.youtube.com/${channel.handle.startsWith('@') ? channel.handle : `@${channel.handle}`}/live`
		);
	}

	function formatUpdated(channel: Channel) {
		const timestamp = channel.updated_at ?? channel.updatedAt;
		if (!timestamp) return 'Pendiente';
		return new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' }).format(
			new Date(timestamp * 1000)
		);
	}
</script>

<svelte:head>
	<title>Admin · Manija TV</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="bg-surface text-on-surface min-h-screen px-4 py-8 sm:px-8">
	<div class="mx-auto max-w-4xl">
		<header class="mb-10 flex items-center justify-between">
			<a
				href="/"
				class="text-on-surface-variant hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
			>
				<ArrowLeft size={16} /> Volver a Manija TV
			</a>
			<div
				class="text-primary flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase"
			>
				<Radio size={16} /> Admin
			</div>
		</header>

		{#if !authenticated}
			<section
				class="border-outline-variant/30 bg-surface-container mx-auto mt-16 max-w-md rounded-2xl border p-7 shadow-2xl sm:p-9"
			>
				<div
					class="bg-primary/10 text-primary mb-6 flex size-12 items-center justify-center rounded-xl"
				>
					<ShieldCheck size={23} />
				</div>
				<p class="text-primary mb-2 text-[10px] font-bold tracking-[0.22em] uppercase">
					Acceso privado
				</p>
				<h1 class="font-headline mb-2 text-2xl font-extrabold">Administrar canales</h1>
				<p class="text-on-surface-variant mb-7 text-sm leading-6">
					Ingresá la contraseña de administración para gestionar los canales monitoreados.
				</p>
				<form onsubmit={login} class="space-y-4">
					<label class="text-on-surface-variant block text-xs font-semibold" for="admin-password"
						>Contraseña</label
					>
					<input
						id="admin-password"
						bind:value={password}
						type="password"
						autocomplete="current-password"
						required
						class="bg-surface-container-low border-outline-variant/40 focus:border-primary w-full rounded-lg border px-4 py-3 text-sm transition-colors outline-none"
						placeholder="Contraseña de admin"
					/>
					{#if error}<p class="text-error text-sm" role="alert">{error}</p>{/if}
					<button
						type="submit"
						disabled={busy}
						class="btn-gradient text-on-primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold tracking-widest uppercase disabled:opacity-60"
					>
						{#if busy}<LoaderCircle size={15} class="animate-spin" />{/if}
						Ingresar
					</button>
				</form>
			</section>
		{:else}
			<div class="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
				<div>
					<p class="text-primary mb-2 text-[10px] font-bold tracking-[0.22em] uppercase">
						Panel de control
					</p>
					<h1 class="font-headline text-3xl font-extrabold sm:text-4xl">Canales monitoreados</h1>
					<p class="text-on-surface-variant mt-2 text-sm">
						Agregá canales de YouTube al chequeo de transmisiones en vivo.
					</p>
				</div>
				<div class="flex gap-2">
					<button
						onclick={refreshChannels}
						disabled={busy}
						class="btn-ghost text-on-surface-variant inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold"
					>
						<RefreshCw size={14} /> Actualizar
					</button>
					<button
						onclick={logout}
						disabled={busy}
						class="btn-ghost text-on-surface-variant inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold"
					>
						<LogOut size={14} /> Salir
					</button>
				</div>
			</div>

			<div class="mb-6 grid grid-cols-2 gap-3 sm:max-w-sm">
				<div class="border-outline-variant/20 bg-surface-container rounded-xl border p-4">
					<p class="text-on-surface-variant text-xs">Canales</p>
					<p class="font-headline mt-1 text-2xl font-bold">{total}</p>
				</div>
				<div class="border-outline-variant/20 bg-surface-container rounded-xl border p-4">
					<p class="text-on-surface-variant text-xs">En vivo</p>
					<p class="font-headline text-secondary mt-1 text-2xl font-bold">{live}</p>
				</div>
			</div>

			<section
				class="border-outline-variant/25 bg-surface-container mb-6 overflow-hidden rounded-2xl border"
			>
				<div class="border-outline-variant/20 flex items-center justify-between border-b px-5 py-4">
					<div class="flex items-center gap-2">
						<Inbox size={17} class="text-primary" />
						<h2 class="font-headline font-bold">Sugerencias de canales</h2>
					</div>
					<button
						onclick={refreshSuggestions}
						disabled={suggestionsLoading}
						class="text-on-surface-variant hover:text-primary text-xs font-semibold transition-colors disabled:opacity-50"
					>
						{suggestionsLoading ? 'Actualizando…' : 'Actualizar'}
					</button>
				</div>
				{#if suggestionsError}
					<p class="text-error px-5 py-4 text-sm" role="alert">{suggestionsError}</p>
				{:else if suggestionsLoading && suggestions.length === 0}
					<p class="text-on-surface-variant px-5 py-8 text-center text-sm">Cargando sugerencias…</p>
				{:else if suggestions.length === 0}
					<p class="text-on-surface-variant px-5 py-8 text-center text-sm">
						Todavía no hay sugerencias.
					</p>
				{:else}
					<ul class="divide-outline-variant/15 divide-y">
						{#each suggestions as suggestion (suggestion.id)}
							<li
								class="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
							>
								<div class="min-w-0 flex-1">
									<div class="mb-2 flex flex-wrap items-center gap-2">
										<span class="status-label suggestion-{suggestion.status}">
											{suggestion.status === 'pending'
												? 'Pendiente'
												: suggestion.status === 'reviewed'
													? 'Revisada'
													: 'Descartada'}
										</span>
										<time
											class="text-on-surface-variant text-xs"
											datetime={new Date(suggestion.created_at * 1000).toISOString()}
										>
											{formatSuggestionDate(suggestion.created_at)}
										</time>
									</div>
									<p class="text-sm leading-6 whitespace-pre-wrap">{suggestion.message}</p>
								</div>
								<div class="flex shrink-0 flex-wrap gap-2">
									{#if suggestion.status !== 'reviewed'}
										<button
											onclick={() => setSuggestionStatus(suggestion, 'reviewed')}
											disabled={suggestionBusyId === suggestion.id}
											class="text-secondary hover:bg-secondary/10 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50"
										>
											<Check size={14} /> Revisada
										</button>
									{/if}
									{#if suggestion.status === 'dismissed'}
										<button
											onclick={() => setSuggestionStatus(suggestion, 'pending')}
											disabled={suggestionBusyId === suggestion.id}
											class="text-on-surface-variant inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/5 disabled:opacity-50"
										>
											<RefreshCw size={14} /> Restaurar
										</button>
									{:else}
										<button
											onclick={() => setSuggestionStatus(suggestion, 'dismissed')}
											disabled={suggestionBusyId === suggestion.id}
											aria-label="Descartar sugerencia"
											class="text-on-surface-variant hover:bg-error/10 hover:text-error inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50"
										>
											<Archive size={14} /> Descartar
										</button>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</section>

			<section
				class="border-outline-variant/25 bg-surface-container mb-6 rounded-2xl border p-5 sm:p-6"
			>
				<h2 class="font-headline mb-1 text-lg font-bold">Agregar un canal</h2>
				<p class="text-on-surface-variant mb-5 text-sm">
					Pegá el handle de YouTube, con o sin <code class="text-primary">@</code>. Se guarda y se
					consulta inmediatamente.
				</p>
				<form onsubmit={addChannel} class="flex flex-col gap-3 sm:flex-row">
					<input
						bind:value={handle}
						type="text"
						autocomplete="off"
						spellcheck="false"
						placeholder="@NombreDelCanal"
						required
						class="bg-surface-container-low border-outline-variant/40 focus:border-primary min-w-0 flex-1 rounded-lg border px-4 py-3 text-sm transition-colors outline-none"
					/>
					<button
						type="submit"
						disabled={busy}
						class="btn-gradient text-on-primary inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-xs font-bold tracking-widest uppercase disabled:opacity-60"
					>
						{#if busy}<LoaderCircle size={15} class="animate-spin" />{:else}<Plus size={15} />{/if}
						Agregar canal
					</button>
				</form>
				{#if error}<p class="text-error mt-4 text-sm" role="alert">{error}</p>{/if}
				{#if notice}<p class="text-secondary mt-4 text-sm" role="status">{notice}</p>{/if}
			</section>

			<section
				class="border-outline-variant/25 bg-surface-container overflow-hidden rounded-2xl border"
			>
				<div class="border-outline-variant/20 flex items-center justify-between border-b px-5 py-4">
					<h2 class="font-headline font-bold">Lista de canales</h2>
					<span class="text-on-surface-variant text-xs"
						>Actualización automática cada 5 minutos</span
					>
				</div>
				{#if channels.length === 0}
					<p class="text-on-surface-variant px-5 py-8 text-center text-sm">
						Todavía no hay canales para mostrar.
					</p>
				{:else}
					<ul class="divide-outline-variant/15 divide-y">
						{#each channels as channel (channel.id)}
							<li
								class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
							>
								<div class="flex min-w-0 items-center gap-3">
									<span class:online={channel.status === 'live'} class="status-dot"></span>
									<div class="min-w-0">
										<p class="truncate text-sm font-semibold">{channel.handle}</p>
										<p class="text-on-surface-variant mt-1 text-xs">
											Revisado: {formatUpdated(channel)}
										</p>
									</div>
								</div>
								<div class="flex items-center justify-between gap-4 sm:justify-end">
									<span class:live-label={channel.status === 'live'} class="status-label"
										>{channel.status === 'live' ? 'En vivo' : 'Offline'}</span
									>
									<a
										href={youtubeUrl(channel)}
										target="_blank"
										rel="noreferrer"
										class="text-on-surface-variant hover:text-primary inline-flex items-center gap-1 text-xs transition-colors"
									>
										Abrir YouTube <ExternalLink size={13} />
									</a>
									<button
										onclick={() => (channelToDelete = channel)}
										disabled={busy}
										aria-label={`Quitar ${channel.handle}`}
										title="Quitar canal"
										class="text-on-surface-variant hover:bg-error/10 hover:text-error inline-flex size-9 items-center justify-center rounded-lg transition-colors disabled:opacity-50"
									>
										<Trash2 size={15} />
									</button>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/if}
	</div>
</main>

{#if channelToDelete}
	<div
		class="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
		role="presentation"
		onclick={(event) => {
			if (event.target === event.currentTarget && !busy) channelToDelete = null;
		}}
	>
		<div
			class="border-outline-variant/30 bg-surface-container w-full max-w-md rounded-2xl border p-6 shadow-2xl"
			role="alertdialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="remove-channel-title"
			aria-describedby="remove-channel-description"
		>
			<div class="mb-5 flex items-start justify-between">
				<div class="bg-error/10 text-error flex size-11 items-center justify-center rounded-xl">
					<Trash2 size={20} />
				</div>
				<button
					onclick={() => (channelToDelete = null)}
					disabled={busy}
					aria-label="Cancelar"
					class="text-on-surface-variant hover:text-on-surface rounded-lg p-2 transition-colors"
				>
					<X size={18} />
				</button>
			</div>
			<h2 id="remove-channel-title" class="font-headline text-on-surface text-xl font-bold">
				Quitar canal
			</h2>
			<p id="remove-channel-description" class="text-on-surface-variant mt-2 text-sm leading-6">
				¿Dejar de monitorear <strong class="text-on-surface">{channelToDelete.handle}</strong>? No
				va a reaparecer al reiniciar el servicio. Podés volver a agregarlo más adelante.
			</p>
			<div class="mt-7 flex justify-end gap-3">
				<button
					onclick={() => (channelToDelete = null)}
					disabled={busy}
					class="btn-ghost text-on-surface-variant rounded-lg px-4 py-2.5 text-xs font-bold"
				>
					Cancelar
				</button>
				<button
					onclick={removeChannel}
					disabled={busy}
					class="bg-error text-on-error hover:bg-error/90 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-colors disabled:opacity-60"
				>
					{#if busy}<LoaderCircle size={14} class="animate-spin" />{:else}<Trash2 size={14} />{/if}
					Quitar canal
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.status-dot {
		width: 0.55rem;
		height: 0.55rem;
		flex: none;
		border-radius: 9999px;
		background: #737373;
	}
	.status-dot.online {
		background: #00e3fd;
		box-shadow: 0 0 12px rgb(0 227 253 / 0.6);
	}
	.status-label {
		border-radius: 9999px;
		background: rgb(115 115 115 / 0.14);
		padding: 0.3rem 0.65rem;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #a3a3a3;
	}
	.status-label.live-label {
		background: rgb(0 227 253 / 0.1);
		color: #00e3fd;
	}
	.status-label.suggestion-pending {
		background: rgb(251 191 36 / 0.12);
		color: #fbbf24;
	}
	.status-label.suggestion-reviewed {
		background: rgb(0 227 253 / 0.1);
		color: #00e3fd;
	}
	.status-label.suggestion-dismissed {
		background: rgb(115 115 115 / 0.14);
		color: #a3a3a3;
	}
</style>
