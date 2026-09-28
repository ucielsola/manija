import { UCIEL_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { isAdminSessionValid, isSameOrigin } from '$lib/server/adminAuth';
import type { RequestHandler } from './$types';

const BACKEND_URL = 'https://api.uciel.xyz';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	if (!isSameOrigin(request, url))
		return json({ error: 'Invalid request origin' }, { status: 403 });
	if (!(await isAdminSessionValid(cookies))) {
		return json({ error: 'Authentication required' }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	try {
		const response = await fetch(`${BACKEND_URL}/manija/channels`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${UCIEL_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		const responseBody = await response.json();
		return json(responseBody, { status: response.status });
	} catch {
		return json({ error: 'Could not reach the Manija API' }, { status: 502 });
	}
};
