import { AppStorage } from "$lib/models/appStorage";
import { Source, type SourceData } from "$lib/models/source.svelte";
import { youtubeURLs } from "$lib/utils/youtubeURLs";

export class SourceList {
    private _storage?: AppStorage;
    private _sources = $state<Source[]>([]);
    private _pinned = $derived<Source[]>(this._sources.filter((source) => source.pinned));
    private _muted = $derived<Source[]>(this._sources.filter((source) => source.muted));
    private _allMuted = $derived<boolean>(this._muted.length === this._sources.length);

    initStorage(): void {
        if (this._storage) {
            console.warn("Storage is already initialized.");
            return;
        }

        this._storage = new AppStorage();
        this._sources = (this._storage.get<SourceData[]>('sources') ?? []).map(sd => new Source(sd));
    }

    get sources(): Source[] {
        return this._sources.toReversed()
    }

    get pinned(): Source[] {
        return this._pinned.toReversed()
    }

    get allMuted(): boolean {
        return this._allMuted;
    }

    toggleSourcePin(id: string): void {
        this.checkStorage();
        if (!id || !this._sources?.length) return;

        const source = this._sources.find((source) => source.id === id);
        if (!source) return;

        source.pinned = !source.pinned;
        this._storage!.set('sources', this._sources.map(s => s.data));
    }

    addSource({name, url}: {name: string, url: string}): void {
        this.checkStorage();
        if (!name || !url) return;

        const id = youtubeURLs.extractURLId(url);

        const existingSource = this._sources.find((source) => source.id === id);
        
        if (existingSource) return;

        const newSource = new Source({url, name, pinned: false});
        
        this._sources.push(newSource);

        this._storage!.set('sources', this._sources.map(s => s.data)); 
    }

    deleteSource(id: string, onSuccess?: () => void): void {
        this.checkStorage();
        if (!id || !this._sources?.length) return;

        this._sources = this._sources.filter((source) => source.id !== id);
        this._storage!.set('sources', this._sources.map(s => s.data));
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
