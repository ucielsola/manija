import { isAdminSessionValid } from '$lib/server/adminAuth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch, url, setHeaders }) => {
	setHeaders({ 'cache-control': 'no-store' });
	const authenticated = await isAdminSessionValid(cookies);
	if (!authenticated) return { authenticated, channels: [], total: 0, live: 0 };

	try {
		const response = await fetch(new URL('/api/streams', url));
		if (!response.ok) return { authenticated, channels: [], total: 0, live: 0 };

		const data = await response.json();
		return {
			authenticated,
			channels: data.channels ?? [],
			total: data.total ?? 0,
			live: data.live ?? 0
		};
	} catch {
		return { authenticated, channels: [], total: 0, live: 0 };
	}
};
