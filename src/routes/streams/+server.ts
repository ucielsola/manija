import type { RequestHandler } from './$types';
import { fetchStreams } from '$lib/services/streamsService';

export const GET: RequestHandler = async () => {
	try {
		const data = await fetchStreams();
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error in streams API route:', error);

		return new Response(
			JSON.stringify({
				channels: [],
				updated_at: 0,
				total: 0,
				live: 0,
				last_refresh: 0,
				rate_limit: {
					locked: false,
					remaining: 0
				}
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
