// Function for converting Coordinates to Addresses
// Function for converting Coordinates to Addresses (JavaScript version)
async function convertCoordsToAddresses(latitudes, longitudes) {
	if (latitudes.length !== longitudes.length) {
		throw new Error("Latitude and longitude arrays must be the same length.");
	}

	const results = [];

	for (let i = 0; i < latitudes.length; i++) {
	const lat = latitudes[i];
	const lon = longitudes[i];
	const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent": "MyApp/1.0 (you@example.com)",
			},
		});

		if (!response.ok) throw new Error(`HTTP error ${response.status}`);
		const data = await response.json();
		results.push(data.display_name ?? "No address found");
	} catch (err) {
		console.error(`Error for (${lat}, ${lon}):`, err);
		results.push("Error retrieving address");
	}

	await new Promise(resolve => setTimeout(resolve, 1000)); // rate limit
	}
  
	return results;
}

export async function load({ fetch, url }) {
	const loc = url.searchParams.get('location');
	const locParam = loc ? '?location=' + loc : ''; 

	const res = await fetch(`/api/arduino-data${locParam}`, { method: 'GET' } );
	const result = await res.json();

	// Fetch values save addresses
	const phValues = result.range.map(item => item.ph);
	const turbValues = result.range.map(item => item.turbidity);
	const dates = result.range.map(item => item.created_at);
	const locID = result.locations.map(item => item.id);
	const locName = result.locations.map(item => item.name);
	const locLong = result.locations.map(item => item.longitude);
	const locLat = result.locations.map(item => item.latitude);

	let locAddress;

	// Use function above to get the addresses of the longitude, latitudes
	try {
		locAddress = await convertCoordsToAddresses(locLat, locLong);
		console.log("Location Addresses:", locAddress);
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
	console.log(result.latest);

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
