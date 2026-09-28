import { json } from '@sveltejs/kit';
import { isAdminSessionValid } from '$lib/server/adminAuth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const authenticated = await isAdminSessionValid(cookies);
	return json({ authenticated }, { status: authenticated ? 200 : 401 });
};
