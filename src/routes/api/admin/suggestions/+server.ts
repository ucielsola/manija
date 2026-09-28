import { UCIEL_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { isAdminSessionValid } from '$lib/server/adminAuth';
import type { RequestHandler } from './$types';

const BACKEND_URL = 'https://api.uciel.xyz';

export const GET: RequestHandler = async ({ cookies }) => {
	if (!(await isAdminSessionValid(cookies))) {
		return json({ error: 'Authentication required' }, { status: 401 });
	}

	try {
		const response = await fetch(`${BACKEND_URL}/manija/suggestions`, {
			headers: { Authorization: `Bearer ${UCIEL_API_KEY}` },
			cache: 'no-store'
		});
		const body = await response.json();
		return json(body, { status: response.status });
	} catch {
		return json({ error: 'Could not reach the Manija API' }, { status: 502 });
	}
};
