<script>
	import Map from '$lib/Map.svelte';

	export let data;
	const { locID, locAddress, locLong, locLat } = data;

	let markers = locID.map((id, i) => ({
		lng: locLong[i],
		lat: locLat[i],
		name: 'loc #' + (i+1),
		href: id,
	}));

	let selectedLoc = null;
	let selectedID = null;
  </script>
  

<div class="flex flex-wrap items-center justify-center space-x-0 sm:space-x-5 space-y-5 mt-5">
	<div class="w-50 h-auto bg-gray-100 px-4 py-3.5 rounded-lg space-y-2">
		{#if !selectedLoc}
			<p>Please select a location</p>
		{:else}
			<p>{selectedLoc}</p>
			<!-- IMAGE? -->

			<!-- BUTTON -->
			<a href="/readings?location={selectedID}" class="inline-block bg-blue-500 text-white px-4 py-2 rounded">
				View readings
			</a>  
		{/if}
	</div>

	<div class="h-150 w-250 rounded-sm">
		<Map markers={markers} bind:selectedLoc={selectedLoc} bind:selectedID={selectedID} />
	</div>
</div>