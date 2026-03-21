import type { StreamsResponse } from '$lib/types/streams';

const API_BASE = import.meta.env.PUBLIC_UCIEL_API || 'https://api.uciel.xyz';

export async function fetchStreams(): Promise<StreamsResponse | void> {
	const apiKey = import.meta.env.UCIEL_API_KEY || '';

	try {
		const response = await fetch(`${API_BASE}/manija/streams`, {
			headers: {
				Authorization: `Bearer ${apiKey}`
			}
		});

		return await response.json();
	} catch (error) {
		console.error('Error fetching streams:', error);
	}
}
