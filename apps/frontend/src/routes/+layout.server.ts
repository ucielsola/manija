import type { LiveSource } from '$lib/types/common';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
    const res = await fetch('https://manija-sources.up.railway.app/live');
    const liveSources = await res.json()
	return {
		liveSources: liveSources as LiveSource[]
	};
};