import { json } from '@sveltejs/kit';
import {
	adminPasswordConfigured,
	createAdminSession,
	isSameOrigin,
	passwordMatches
} from '$lib/server/adminAuth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	if (!isSameOrigin(request, url))
		return json({ error: 'Invalid request origin' }, { status: 403 });
	if (!adminPasswordConfigured()) {
		return json({ error: 'Admin password is not configured' }, { status: 503 });
	}

	let password: unknown;
	try {
		({ password } = await request.json());
	} catch {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	if (!passwordMatches(password)) {
		return json({ error: 'Incorrect password' }, { status: 401 });
	}

	await createAdminSession(cookies);
	return json({ authenticated: true });
};
