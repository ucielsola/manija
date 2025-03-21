import YouTubeIFrameCtrl from 'youtube-iframe-ctrl';
import  type { YouTubeMessage } from "$lib/types/common";

export type SourceControllerEvents = "muteChange"

export class SourceController {
   private controller: YouTubeIFrameCtrl | null = null;
   private eventListeners: { [key: string]: (x: unknown) => void } = {};
   private lastMutedState = $state<boolean>(false);

    constructor(iframe: HTMLIFrameElement) {
        console.log("SourceController constructor");
        this.controller = new YouTubeIFrameCtrl(iframe);

        iframe.addEventListener('ytmessage' as keyof HTMLElementEventMap, (e: Event)=> {
            const message = (e as CustomEvent).detail as YouTubeMessage;
            const muted = message.info?.muted

            if(muted === undefined) return;

            if (muted !== this.lastMutedState) {
                this.lastMutedState = muted;
                this.eventListeners["muteChange"]?.(muted);
            }
        });
    }

    play() {
        this.controller?.play();
    }

    pause() {
        this.controller?.pause();
    }

    mute() {
        this.controller?.mute();
    }

    unMute() {
        this.controller?.unMute();
    }

    on(event: SourceControllerEvents, callback: (x: unknown)=> void) {
        this.eventListeners[event] = callback
    }
}