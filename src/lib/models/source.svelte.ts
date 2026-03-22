import { youtubeURLs } from '$lib/utils/youtubeURLs';
import { SourceController } from '$lib/models/sourceController.svelte';

export type SourceData = {
	url: string;
	name: string;
	pinned: boolean;
};

export class Source {
	private _id: string;
	private _name: string;
	private _url: string;
	private _embedUrl: string;
	private _thumbnail: string;
	private _pinned: boolean = $state(false);
	private _muted: boolean = $state(false);
	private _playing: boolean = $state(false);
	private _controller?: SourceController;

	constructor({ url, name, pinned = false }: SourceData) {
		this._name = name;
		this._url = url;
		this._embedUrl = youtubeURLs.makeEmbedURL(url) || '';
		this._id = youtubeURLs.extractURLId(url) || '';
		this._thumbnail = youtubeURLs.thumbnailURL(this._id);
		this._pinned = pinned;
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get url() {
		return this._url;
	}

	get embedUrl() {
		return this._embedUrl;
	}

	get thumbnail() {
		return this._thumbnail;
	}

	get pinned() {
		return this._pinned;
	}

	set pinned(value: boolean) {
		this._pinned = value;
	}

	get muted() {
		return this._muted;
	}

	get playing() {
		return this._playing;
	}

	get data(): SourceData {
		return {
			url: this._url,
			name: this._name,
			pinned: this._pinned
		};
	}

	attachController(iframe: HTMLIFrameElement) {
		if (!iframe) return;

		console.log('[Source] Attaching controller for:', this._name);
		this._controller = new SourceController(iframe);
		this._controller.on('muteChange', (muted: unknown) => {
			this._muted = muted as boolean;
		});
		this._controller.on('playbackChange', (playing: unknown) => {
			console.log('[Source] Playback change for', this._name, ':', playing);
			this._playing = playing as boolean;
		});
	}

	togglePin() {
		this._pinned = !this._pinned;
	}

	play() {
		this._controller?.play();
	}

	pause() {
		this._controller?.pause();
	}

	togglePlay() {
		if (this._playing) {
			this.pause();
		} else {
			this.play();
		}
	}

	setMute(mute: boolean) {
		if (this._controller) {
			if (mute) {
				this._controller.mute();
			} else {
				this._controller.unMute();
			}
		}
	}
}
