import { json } from '@sveltejs/kit';
import { clearAdminSession, isSameOrigin } from '$lib/server/adminAuth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ request, cookies, url }) => {
	if (!isSameOrigin(request, url))
		return json({ error: 'Invalid request origin' }, { status: 403 });
	clearAdminSession(cookies);
	return json({ authenticated: false });
};
