import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('manija-tv-theme'); // 'dark' | 'light' | undefined

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			if (!theme) return html;
			return html.replace('<html', `<html data-theme="${theme}"`);
		}
	});

	return response;
};
