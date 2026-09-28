import type { StreamsResponse } from '$lib/types/streams';

export async function fetchStreams(): Promise<StreamsResponse> {
	const response = await fetch('/api/streams');
	if (!response.ok) throw new Error(`Streams API returned ${response.status}`);
	return response.json();
}
