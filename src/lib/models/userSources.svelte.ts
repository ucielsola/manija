import { AppStorage } from '$lib/models/appStorage';
import { Source, type SourceData } from '$lib/models/source.svelte';
import { youtubeURLs } from '$lib/utils/youtubeURLs';

export class UserSources {
	private _storage?: AppStorage;
	private _sources = $state<Source[]>([]);
	private _pinned = $derived<Source[]>(this._sources.filter((source) => source.pinned));
	private _muted = $derived<Source[]>(this._sources.filter((source) => source.muted));
	private _allMuted = $derived<boolean>(this._muted.length === this._sources.length);
	private _loading = $state<boolean>(false);

	async initStorage(): Promise<void> {
		if (this._storage) {
			console.warn('Storage ya está inicializado.');
			return;
		}

		this._loading = true;

		await new Promise((resolve) => setTimeout(resolve, 0));

		this._storage = new AppStorage();
		this._sources = (this._storage.get<SourceData[]>('sources') ?? []).map((sd) => new Source(sd));

		this._loading = false;
	}

	get sources(): Source[] {
		return this._sources.toReversed();
	}

	get pinned(): Source[] {
		return this._pinned.toReversed();
	}

	get allMuted(): boolean {
		return this._allMuted;
	}

	get loading(): boolean {
		return this._loading;
	}

	toggleSourcePin(id: string): void {
		this.checkStorage();
		if (!id || !this._sources?.length) return;

		const source = this._sources.find((source) => source.id === id);
		if (!source) return;

		source.pinned = !source.pinned;
		this._storage!.set(
			'sources',
			this._sources.map((s) => s.data)
		);
	}

	addSource({ name, url }: { name: string; url: string }): void {
		this.checkStorage();
		if (!name || !url) return;

		if (!youtubeURLs.isValidYouTubeUrl(url)) {
			console.error('URL de YouTube inválida:', url);
			return;
		}

		const id = youtubeURLs.extractURLId(url);

		if (!id) {
			console.error('No se pudo extraer ID de la URL:', url);
			return;
		}

		const existingSource = this._sources.find((source) => source.id === id);

		if (existingSource) return;

		const newSource = new Source({ url, name, pinned: false });

		this._sources.push(newSource);

		this._storage!.set(
			'sources',
			this._sources.map((s) => s.data)
		);
	}

	renameSource(id: string, name: string): void {
		this.checkStorage();
		if (!id || !this._sources?.length) return;

		const source = this._sources.find((source) => source.id === id);
		if (!source) return;

		source.name = name;
		this._storage!.set(
			'sources',
			this._sources.map((s) => s.data)
		);
	}

	deleteSource(source: Source, onSuccess?: () => void): void {
		this.checkStorage();

		if (!this._sources?.length) {
			console.error('No se puede eliminar: array de fuentes está vacío');
			return;
		}

		const sourceIndex = this._sources.indexOf(source);
		if (sourceIndex === -1) {
			console.error('No se puede eliminar: fuente no encontrada');
			return;
		}

		this._sources = this._sources.filter((s) => s !== source);
		this._storage!.set(
			'sources',
			this._sources.map((s) => s.data)
		);
		onSuccess?.();
	}

	muteAll(): void {
		this._sources.forEach((source) => source.setMute(true));
	}

	deleteAllSources(): void {
		this.checkStorage();
		this._sources = [];
		this._storage!.set('sources', []);
	}

	reset(): void {
		this.checkStorage();
		this._sources = [];
		this._storage!.set('sources', []);
	}

	private checkStorage(): void {
		if (!this._storage) {
			this.initStorage();
		}
	}
}
