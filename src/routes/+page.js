export async function load({ fetch }) {
	const res = await fetch('/api/arduino-data', { method: 'GET' } );
	const result = await res.json();

	return {
		reading: result.data ?? null
	};
}
