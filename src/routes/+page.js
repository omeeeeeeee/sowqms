export async function load({ fetch, url }) {
	const loc = url.searchParams.get('location');
	const locParam = loc ? '?location=' + loc : ''; 

	const res = await fetch(`/api/arduino-data${locParam}`, { method: 'GET' } );
	const result = await res.json();

	const phValues = result.range.map(item => item.ph);
	const turbValues = result.range.map(item => item.turbidity);
	const dates = result.range.map(item => item.created_at);
	const locID = result.locations.map(item => item.id);
	const locAddress = [
		'Pasig River',
		'UP AECH'
	]

	// console.log(result.latest);
	// console.log(phValues);
	// console.log(turbValues);
	// console.log(dates);

	return {
		reading: result.latest ?? null,
		phValues: phValues ?? null,
		turbValues: turbValues ?? null,
		dates: dates ?? null,
		locID: locID ?? null,
		locAddress: locAddress ?? null
	};
}
