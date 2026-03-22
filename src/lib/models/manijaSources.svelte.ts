import { AppStorage } from '$lib/models/appStorage';
import { Source, type SourceData } from '$lib/models/source.svelte';
import { youtubeURLs } from '$lib/utils/youtubeURLs';
import { fetchStreams } from '$lib/services/streamsService';
import type { Channel } from '$lib/types/streams';

export class ManijaSources {
	private _storage?: AppStorage;
	private _sources = $state<Source[]>([]);
	private _pinned = $derived<Source[]>(this._sources.filter((source) => source.pinned));
	private _muted = $derived<Source[]>(this._sources.filter((source) => source.muted));
	private _allMuted = $derived<boolean>(this._muted.length === this._sources.length);
	private _loading = $state<boolean>(false);
	private _lastFetch = $state<number>(0);

	async init(): Promise<void> {
		if (this._storage) {
			console.warn('ManijaSources ya está inicializado.');
			return;
		}

		this._storage = new AppStorage();
		await this.fetchSources();
	}

	async fetchSources(): Promise<void> {
		this._loading = true;

		if (!this._storage) {
			this._storage = new AppStorage();
		}

		const response = await fetchStreams();
		if (!response?.channels) {
			this._loading = false;
			return;
		}

		const pinnedData =
			this._storage.get<{ id: string; pinned: boolean }[]>('manijaSourcesPinned') ?? [];

		this._sources = response.channels
			.map((channel) => this.channelToSource(channel, pinnedData))
			.filter((source): source is Source => source !== null);

		this._lastFetch = Date.now();
		this._loading = false;
	}

	private channelToSource(
		channel: Channel,
		pinnedData: { id: string; pinned: boolean }[]
	): Source | null {
		const videoId = youtubeURLs.extractURLId(channel.live_url);
		if (!videoId) return null;

		const pinned = pinnedData.find((d) => d.id === videoId)?.pinned ?? false;

		const data: SourceData = {
			url: channel.live_url,
			name: channel.handle,
			pinned
		};

		return new Source(data);
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

	get lastFetch(): number {
		return this._lastFetch;
	}

	toggleSourcePin(id: string): void {
		if (!id || !this._sources?.length) return;

		const source = this._sources.find((source) => source.id === id);
		if (!source) return;

		source.pinned = !source.pinned;
		this.savePinnedState();
	}

	muteAll(): void {
		this._sources.forEach((source) => source.setMute(true));
	}

	private savePinnedState(): void {
		const pinnedData = this._sources.map((s) => ({ id: s.id, pinned: s.pinned }));
		this._storage!.set('manijaSourcesPinned', pinnedData);
	}

	reset(): void {
		this._sources = [];
		this._lastFetch = 0;
	}
}
