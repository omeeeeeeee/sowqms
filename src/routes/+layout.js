import { redirect } from '@sveltejs/kit';

export async function load({ fetch, url }) {
	const loc = url.searchParams.get('location');

	if (!loc && url.pathname === '/readings') {
        throw redirect(303, '/map');
    }

	return;
}
