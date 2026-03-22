import { UCIEL_API_KEY } from '$env/static/private';

const BACKEND_URL = 'https://api.uciel.xyz';

export async function GET(): Promise<Response> {
	try {
		const response = await fetch(`${BACKEND_URL}/manija/streams`, {
			headers: {
				Authorization: `Bearer ${UCIEL_API_KEY}`
			}
		});

		if (!response.ok) {
			return Response.json(
				{ error: `API returned status ${response.status}`, channels: [] },
				{ status: response.status }
			);
		}

		const text = await response.text();
		const data = JSON.parse(text);
		return Response.json(data);
	} catch (error) {
		return Response.json({ error: 'Failed to fetch streams', channels: [] }, { status: 500 });
	}
}
