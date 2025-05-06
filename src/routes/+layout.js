import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
    const loc = url.searchParams.get('location');

    if (!loc) {
        throw redirect(303, '/?location=d942b0f8-0485-44a2-a4e5-db4266eb327f');
    }

    return;
}
