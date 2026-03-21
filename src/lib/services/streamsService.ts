import type { StreamsResponse } from '$lib/types/streams';

export async function fetchStreams(): Promise<StreamsResponse | void> {
	try {
		const response = await fetch('/api/streams');

		if (!response.ok) {
			const text = await response.text();
			console.error('[streamsService] Error response body:', text);
			return;
		}

		const data = await response.json();
		console.log('[streamsService] Success, channels:', data?.channels?.length);
		return data;
	} catch (error) {
		console.error('[streamsService] Fetch error:', error);
	}
}
