import convertCoordsToAddresses from '$lib/convertCoords.js';

export async function load({ fetch, url }) {
	const loc = url.searchParams.get('location');
	const locParam = loc ? '?location=' + loc : ''; 

	const res = await fetch(`/api/arduino-data${locParam}`, { method: 'GET' } );
	const result = await res.json();

	// Fetch values save addresses
	/*
	const phValues = result.range.map(item => item.ph);
	const turbValues = result.range.map(item => item.turbidity);
	const dates = result.range.map(item => item.created_at);
	*/
	const locID = result.locations.map(item => item.id);
	const locName = result.locations.map(item => item.name);
	const locLong = result.locations.map(item => item.longitude);
	const locLat = result.locations.map(item => item.latitude);

	let locAddress;

	// Use function above to get the addresses of the longitude, latitudes
	try {
		locAddress = await convertCoordsToAddresses(locLat, locLong);
		// console.log("Location Addresses:", locAddress);
	} catch (error) {
		console.error("Error retrieving addresses:", error);
	}

	// console.log(result.latest);
	// console.log(phValues);
	// console.log(turbValues);
	// console.log(dates);

    // console.log(locAddress);

	return {
		locID: locID ?? null,
		locLong: locLong ?? null,
		locLat: locLat ?? null,
		locName: locName ?? null,
		locAddress: locAddress ?? null
	};
}
