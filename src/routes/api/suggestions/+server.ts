import { UCIEL_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { isSameOrigin } from '$lib/server/adminAuth';
import type { RequestHandler } from './$types';

const BACKEND_URL = 'https://api.uciel.xyz';

export const POST: RequestHandler = async ({ request, url, getClientAddress }) => {
	if (!isSameOrigin(request, url))
		return json({ error: 'Invalid request origin' }, { status: 403 });

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	if (!body || typeof body !== 'object') {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	const payload = body as { message?: unknown; website?: unknown };
	if (typeof payload.website === 'string' && payload.website.trim()) {
		return json({ ok: true });
	}
	if (typeof payload.message !== 'string') {
		return json({ error: 'Escribí qué canal te gustaría ver.' }, { status: 400 });
	}

	const message = payload.message.trim();
	if (!message || message.length > 500) {
		return json({ error: 'La sugerencia debe tener entre 1 y 500 caracteres.' }, { status: 400 });
	}

	try {
		const response = await fetch(`${BACKEND_URL}/manija/suggestions`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${UCIEL_API_KEY}`,
				'Content-Type': 'application/json',
				'X-Manija-Client-IP': getClientAddress()
			},
			body: JSON.stringify({ message })
		});

		if (!response.ok) {
			return json(
				{ error: 'No se pudo guardar la sugerencia. Intentá de nuevo.' },
				{ status: 502 }
			);
		}
		return json({ ok: true });
	} catch {
		return json(
			{ error: 'No se pudo conectar con el servidor. Intentá de nuevo.' },
			{ status: 502 }
		);
	}
};
