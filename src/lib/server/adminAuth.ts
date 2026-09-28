import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'manija-admin-session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

async function sessionSignature(payload: string): Promise<string> {
	const secret = new TextEncoder().encode(env.MANIJA_ADMIN_PASSWORD ?? '');
	const key = await crypto.subtle.importKey(
		'raw',
		secret,
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const signature = new Uint8Array(
		await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
	);
	let binary = '';
	for (const byte of signature) binary += String.fromCharCode(byte);
	return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export function adminPasswordConfigured(): boolean {
	return Boolean(env.MANIJA_ADMIN_PASSWORD);
}

export async function isAdminSessionValid(cookies: Cookies): Promise<boolean> {
	if (!adminPasswordConfigured()) return false;

	const token = cookies.get(COOKIE_NAME);
	if (!token) return false;

	const [payload, signature, extra] = token.split('.');
	if (!payload || !signature || extra) return false;

	const expected = await sessionSignature(payload);
	if (!constantTimeEqual(signature, expected)) return false;

	const expiresAt = Number(payload.split(':', 1)[0]);
	return Number.isSafeInteger(expiresAt) && expiresAt > Date.now();
}

export async function createAdminSession(cookies: Cookies): Promise<void> {
	const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
	const payload = `${expiresAt}:${crypto.randomUUID()}`;
	const token = `${payload}.${await sessionSignature(payload)}`;

	cookies.set(COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'strict',
		maxAge: SESSION_TTL_SECONDS
	});
}

export function clearAdminSession(cookies: Cookies): void {
	cookies.delete(COOKIE_NAME, { path: '/' });
}

export function isSameOrigin(request: Request, url: URL): boolean {
	const origin = request.headers.get('origin');
	if (!origin) return false;
	try {
		return new URL(origin).origin === url.origin;
	} catch {
		return false;
	}
}

export function passwordMatches(candidate: unknown): boolean {
	const expected = env.MANIJA_ADMIN_PASSWORD;
	if (!expected || typeof candidate !== 'string') return false;

	return constantTimeEqual(candidate, expected);
}

function constantTimeEqual(left: string, right: string): boolean {
	const encoder = new TextEncoder();
	const leftBytes = encoder.encode(left);
	const rightBytes = encoder.encode(right);
	const length = Math.max(leftBytes.length, rightBytes.length);
	let difference = leftBytes.length ^ rightBytes.length;
	for (let index = 0; index < length; index++) {
		difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
	}
	return difference === 0;
}
