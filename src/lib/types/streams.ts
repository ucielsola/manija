export interface Channel {
	id: number;
	handle: string;
	status: 'live' | 'offline';
	live_url: string;
	updated_at: number;
}

export interface RateLimit {
	locked: boolean;
	remaining: number;
}

export interface StreamsResponse {
	channels: Channel[];
	updated_at: number;
	total: number;
	live: number;
	last_refresh: number;
	rate_limit: RateLimit;
}
