import YouTubeIFrameCtrl from 'youtube-iframe-ctrl';
import type { YouTubeMessage } from '$lib/types/common';

export enum YouTubePlayerState {
	UNSTARTED = -1,
	ENDED = 0,
	PLAYING = 1,
	PAUSED = 2,
	BUFFERING = 3,
	CUED = 5
}

export type SourceControllerEvents = 'muteChange' | 'playbackChange';

export class SourceController {
	private controller: YouTubeIFrameCtrl | null = null;
	private eventListeners: { [key: string]: (x: unknown) => void } = {};
	private lastMutedState = $state<boolean>(false);
	private lastPlayingState = $state<boolean>(false);

	constructor(iframe: HTMLIFrameElement) {
		this.controller = new YouTubeIFrameCtrl(iframe);

		iframe.addEventListener('ytmessage' as keyof HTMLElementEventMap, (e: Event) => {
			const message = (e as CustomEvent).detail as YouTubeMessage;
			const muted = message.info?.muted;
			const playerState = message.info?.playerState;

			if (muted !== undefined && muted !== this.lastMutedState) {
				this.lastMutedState = muted;
				this.eventListeners['muteChange']?.(muted);
			}

			if (playerState === undefined) {
				return;
			}

			const activeStates = [YouTubePlayerState.PLAYING, YouTubePlayerState.BUFFERING];
			const playing = activeStates.includes(playerState);

			if (playing !== this.lastPlayingState) {
				this.lastPlayingState = playing;
				this.eventListeners['playbackChange']?.(playing);
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

	on(event: SourceControllerEvents, callback: (x: unknown) => void) {
		this.eventListeners[event] = callback;
	}
}
