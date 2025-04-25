export async function load({ fetch }) {
	const res = await fetch('/api/arduino-data', { method: 'GET' } );
	console.log(res);
	const result = await res.json();

	console.log('HI ' + String(res.ok) + ' ' + JSON.stringify(result));
	return {
		reading: result.data ?? null
	};
}
