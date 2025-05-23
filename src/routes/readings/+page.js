
import convertCoordsToAddresses from '$lib/convertCoords.js';

// Function for converting Coordinates to Addresses

export async function load({ fetch, url }) {
	const loc = url.searchParams.get('location');
	const locParam = loc ? '?location=' + loc : ''; 

	const res = await fetch(`/api/arduino-data${locParam}`, { method: 'GET' } );
	const result = await res.json();

	// Fetch values save addresses
	const phValues = result.range.map(item => item.ph);
	const turbValues = result.range.map(item => item.turbidity);
	const dates = result.range.map(item => {
			const utcDate = new Date(item.created_at);
			return new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
		});
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

	// basically i if in readings page
	let i = null;	
	if (locParam) {
		i = locID.indexOf(locParam.split("location=")[1]);
		// console.log(i);
	}

    // console.log(locAddress);

	return {
		reading: result.latest ?? null,
		phValues: phValues ?? null,
		turbValues: turbValues ?? null,
		dates: dates ?? null,
		locID: i !== null ? locID[i] : (locID ?? null),
		locLong: i !== null ? locLong[i] : (locLong ?? null),
		locLat: i !== null ? locLat[i] : (locLat ?? null),
		locName: i !== null ? locName[i] : (locName ?? null),
		locAddress: i !== null ? (locAddress[i] ?? null) : (locAddress ?? null)
	};
}
