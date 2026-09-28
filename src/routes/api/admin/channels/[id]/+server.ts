import { UCIEL_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { isAdminSessionValid, isSameOrigin } from '$lib/server/adminAuth';
import type { RequestHandler } from './$types';

const BACKEND_URL = 'https://api.uciel.xyz';

export const DELETE: RequestHandler = async ({ cookies, params, request, url }) => {
	if (!isSameOrigin(request, url)) {
		return json({ error: 'Invalid request origin' }, { status: 403 });
	}
	if (!(await isAdminSessionValid(cookies))) {
		return json({ error: 'Authentication required' }, { status: 401 });
	}
	if (!/^\d+$/.test(params.id)) return json({ error: 'Invalid channel id' }, { status: 400 });

	try {
		const response = await fetch(`${BACKEND_URL}/manija/channels/${params.id}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${UCIEL_API_KEY}` }
		});
		const responseBody = await response.json();
		return json(responseBody, { status: response.status });
	} catch {
		return json({ error: 'Could not reach the Manija API' }, { status: 502 });
	}
};
