import type { StreamsResponse } from '$lib/types/streams';

export async function fetchStreams(): Promise<StreamsResponse> {
	try {
		const response = await fetch('/api/streams');

		if (!response.ok) {
			const text = await response.text();
			console.error('[streamsService] Error response:', text);
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
		console.log('[streamsService] Success, channels:', data?.channels?.length);
		return data;
	} catch (error) {
		console.error('[streamsService] Fetch error:', error);
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
