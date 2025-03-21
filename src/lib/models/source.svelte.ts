import { youtubeURLs } from "$lib/utils/youtubeURLs";
import { SourceController } from "$lib/models/sourceController.svelte";

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
    private _controller?: SourceController;

    constructor({url, name, pinned = false}: SourceData) {
        this._name = name;
        this._url = url;
        this._embedUrl = youtubeURLs.makeEmbedURL(url);
        this._id = youtubeURLs.extractURLId(url);
        this._thumbnail = youtubeURLs.thumbnailURL(this._id);
        this._pinned = pinned;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
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

    get data(): SourceData {
        return {
            url: this._url,
            name: this._name,
            pinned: this._pinned
        };
    }

    attachController(iframe: HTMLIFrameElement) {
        this._controller = new SourceController(iframe);
        this._controller.on("muteChange", (muted: unknown) => {
            this._muted = muted as boolean
        });
       
    }

    togglePin() {
        this._pinned = !this._pinned;
    }

    setMute(mute: boolean) {
        if (this._controller) {
            mute ? this._controller.mute() : this._controller.unMute();
        }
    }
}