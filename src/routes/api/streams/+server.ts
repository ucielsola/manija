import { UCIEL_API_KEY } from '$env/static/private';

const BACKEND_URL = 'https://api.uciel.xyz';

export async function GET(): Promise<Response> {
	console.log('[streams proxy] Request received');
	console.log('[streams proxy] Backend URL:', `${BACKEND_URL}/manija/streams`);
	console.log('[streams proxy] API Key present:', !!UCIEL_API_KEY);

	try {
		const response = await fetch(`${BACKEND_URL}/manija/streams`, {
			headers: {
				Authorization: `Bearer ${UCIEL_API_KEY}`
			}
		});

		console.log('[streams proxy] Response status:', response.status);

		const text = await response.text();
		console.log('[streams proxy] Response body:', text);

		const data = JSON.parse(text);
		return Response.json(data);
	} catch (error) {
		console.error('[streams proxy] Error:', error);
		return Response.json({ error: 'Failed to fetch streams' }, { status: 500 });
	}
}
