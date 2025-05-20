export default async function convertCoordsToAddresses(latitudes, longitudes) {
	const apiKey = '77b3ab13e2ac4de192cc685c22f9180f';

	if (latitudes.length !== longitudes.length) {
		throw new Error("Latitude and longitude arrays must be the same length.");
	}
  
	const requests = latitudes.map((lat, i) => {
	  const lon = longitudes[i];
	  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;
  
	  return fetch(url)
		.then(res => res.json())
		.then(data => {
			const address = data.features?.[0]?.properties?.formatted;
			return address ?? "No address found";
		})
		.catch(err => {
			console.error(`Error for (${lat}, ${lon}):`, err);
			return "Error retrieving address";
		});
	});
  
	return await Promise.all(requests);
}
