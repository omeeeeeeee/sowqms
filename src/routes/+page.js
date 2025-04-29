export async function load({ fetch }) {
	var res = await fetch('/api/arduino-data', { method: 'GET' } );
	const result = await res.json();
	res = await fetch('/api/historical-arduino-data', { method: 'GET'} );
	const complete_result = await res.json();

	console.log(result);
	// console.log(complete_result);

	const phValues = complete_result.data.map(item => item.ph);
	const turbValues = complete_result.data.map(item => item.turbidity);
	const dates = complete_result.data.map(item => item.created_at);

	console.log(phValues);
	console.log(turbValues);
	console.log(dates);

	return {
		reading: result.data ?? null,
		phValues: phValues ?? null,
		turbValues: turbValues ?? null,
		dates: dates ?? null
	};
}
