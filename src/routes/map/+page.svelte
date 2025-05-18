<script>
	import Map from '$lib/Map.svelte';

	export let data;
	const { locID, locAddress, locName, locLong, locLat } = data;

	let markers = locID.map((id, i) => ({
		lng: locLong[i],
		lat: locLat[i],
		name: locName[i],
		addr: locAddress[i],
		href: id,
	}));

	let selected = null;

	function clearSelected() {
		selected = null;
	}
  </script>
  

<div class="flex flex-wrap items-top justify-center space-x-0 sm:space-x-5 space-y-7.5 py-7.5 px-5">
	<div class="h-75 sm:h-130 w-full max-w-230 rounded-md border-2 border-gray-200">
		<Map markers={markers} bind:selected={selected} />
	</div>

	<div class="flex flex-col max-h-130 max-w-130 w-full">
		<div class="flex flex-row items-center justify-between h-14 lexend-semibold rounded-t-md bg-sky-600 text-white">
			{#if selected}
				<p class="ml-5 text-[22px]">{selected.name}</p>
				<button id="clear-selection" class="hover:bg-red-400 px-5 h-full rounded-tr-sm" on:click={clearSelected}>X</button>
			{/if}
		</div>

		<div class="bg-gray-50 border-b-2 border-x-2 border-gray-200 w-full h-full flex flex-col items-center justify-top rounded-b-md p-5 space-y-6.5">
			<div class="flex flex-col items-center space-y-1">
				{#if selected}
					<p class="text-black text-md lexend-semibold">Address</p>
					<p class="text-gray-500 text-sm lexend-regular">{selected.addr}</p>

					<!-- IMAGE -->
					<!-- CURR READINGS -->

					<!-- BUTTON -->
					<br>
					<a href="/readings?location={selected.id}" class="inline-block bg-sky-500 text-white lexend-regular text-sm hover:bg-sky-600 px-4 py-2 rounded-lg">
						View readings
					</a>
				{:else}
					<p class="text-gray-500 text-sm lexend-regular">Please select a location first.</p>
				{/if}
			</div>
		</div>
	</div>	
</div>