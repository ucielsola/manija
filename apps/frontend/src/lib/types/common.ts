export type ColorType = "neutral" | "primary" | "secondary" | "accent" | "error" | "warning" | "info" | "success";
export type SizeType = "xs" | "sm" | "lg" | "xl";
export type YouTubeMessage = {event: string, info: {
    playerState: YouTubePlayerState,
    muted: boolean
} | null, channel: string};

export enum YouTubePlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5
}