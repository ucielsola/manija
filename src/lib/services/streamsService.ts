import type { StreamsResponse } from '$lib/types/streams';

export async function fetchStreams(): Promise<StreamsResponse> {
	try {
		const response = await fetch('/api/streams');

		if (!response.ok) {
			return {
				channels: [],
				total: 0,
				live: 0,
				last_refresh: 0,
				updated_at: 0,
				rate_limit: { locked: false, remaining: 0 }
			};
		}

		const data = await response.json();
		return data;
	} catch (error) {
		return {
			channels: [],
			total: 0,
			live: 0,
			last_refresh: 0,
			updated_at: 0,
			rate_limit: { locked: false, remaining: 0 }
		};
	}
}
