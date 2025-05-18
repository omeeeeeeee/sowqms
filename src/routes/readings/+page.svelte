  

<script lang="ts">
	// get readings from +page.js
	export let data;
	const { reading, phValues, turbValues, dates, locLat, locLong, locID, locName, locAddress } = data;

	// imports
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { createClient } from '@supabase/supabase-js';
	import { chartRender } from '$lib/chartRender.js';
	import { ChartData } from '$lib/chartData';
	import Map from '$lib/Map.svelte';
	import { DateTime } from 'luxon';	
	
	/*
	// variables for ensuring page refreshes when new location is selected
	let currentLoc = "";
	let selectedLoc = "";
	let locOptions = locID.map((v, i) => ({ id: v, location: locAddress[i] }));
	$: if (selectedLoc && currentLoc != selectedLoc) {
		goto(`/?location=${selectedLoc}`, { invalidateAll: true });
    	window.location.href = `/?location=${selectedLoc}`;
  	}
	*/

	let marker = [{
		lng: locLong,
		lat: locLat,
		name: locName,
		addr: locAddress,
		href: locID, 
	}];

	let selected = null;

	// get latest i.e. last pushed reading
	const supabase = createClient(
	  PUBLIC_SUPABASE_URL,
	  PUBLIC_SUPABASE_ANON_KEY
	);
  
	const ph = writable<Number | null>(null);
	const turbidity = writable<Number | null>(null);
	const lastUpdated = writable<string | null>(null);
  
	onMount(() => {
	  const url = new URL(window.location.href);
      const queryParams = new URLSearchParams(url.search);
	  /*
      currentLoc = queryParams.get('location') || '';
	  selectedLoc = currentLoc;
	  */

	  const channel = supabase
		.channel('realtime:sensor_readings')
		.on(
		  'postgres_changes',
		  {
			event: 'INSERT',
			schema: 'public',
			table: 'sensor_readings'
		  },
		  (payload) => {
			const row = payload.new;
			ph.set(row.ph);
			turbidity.set(row.turbidity);
			lastUpdated.set(String(row.created_at));
		  }
		)
		.subscribe();
  
	  return () => {
		supabase.removeChannel(channel);
	  };
	});

	// variables for ph level, turbidity chart filter
	let dateFilter = '';

	let phChart;
	$: phChart = ChartData('pH level', dates, phValues, 'rgba(115, 90, 145, 0.8)', dateFilter);

	let turbChart;
	$: turbChart = ChartData('Turbidity', dates, turbValues, 'rgba(90, 115, 145, 0.8)', dateFilter);
	
	$: currentPh = $ph ?? reading.ph ?? null;

	$: phStatus =
		currentPh === undefined || currentPh === null
		? "N/A"
		: currentPh === 7
		? "Neutral"
		: currentPh < 7
		? "Acidic"
		: "Basic";

	$: currentTurbidity = $turbidity ?? reading.turbidity ?? null;

	// Ref: https://in-situ.com/en/faq/water-quality-information/turbidity-faqs/what-are-typical-turbidity-values-in-natural-environments?srsltid=AfmBOoqX5CR7qDVYosA1G-2JTLVTodYZz-X38FniG8vWrQ1wAvgPEFFp
	$: turbidityStatus =
	currentTurbidity === undefined || currentTurbidity === null
		? "N/A"
		: currentTurbidity <= 1
		? "Safe (Drinking/Treated)"
		: currentTurbidity <= 10
		? "Safe (Freshwater)"
		: currentTurbidity <= 100
		? "Stressful to Aquatic Life"
		: "Unsafe for Aquatic Life";

	$: turbidityStatusClass =
		turbidityStatus.includes("Unsafe") ? "unsafe" :
		turbidityStatus.includes("Stressful") ? "stress" :
		turbidityStatus.includes("Safe") ? "safe" : "";

	$: waterStatus =
		currentPh === null || currentTurbidity === null
			? "Unknown"
			: (currentPh >= 6.5 && currentPh <= 8.5 && currentTurbidity <= 10)
			? "SAFE"
			: "UNSAFE";

	$: waterStatusClass =
		waterStatus === "SAFE" ? "wssafe" :
		waterStatus === "UNSAFE" ? "wsunsafe" : "";
</script>

<div class="py-5 px-7.5 space-y-2">
	

	<div class="flex flex-col sm:flex-row h-auto max-h-100">
		<div class="flex flex-col items-center justify-center text-white rounded-t-md sm:rounded-r-none sm:rounded-l-md bg-sky-600 px-5 py-2">
			<!-- IMG -->
			<p class="lexend-semibold text-[30px]">{locName}</p>
			<p class="lexend-regular text-center text-sm">{locAddress}</p>
		</div>

		<div class="h-75 w-full rounded-b-md sm:rounded-l-none sm:rounded-r-md border-2 border-gray-200">
			<Map markers={marker} selected={selected} />
		</div>
	</div>

	<br>

	<div class="flex flex-col">
		<p class="text-[22px] lexend-semibold text-white rounded-t-md bg-sky-600 px-5 py-2">Current readings</p>

		<div class="bg-gray-50 border-b-2 border-x-2 border-gray-200 w-full flex flex-col items-center justify-center rounded-b-md p-5 space-y-6.5">
			<div class="flex flex-col items-center space-y-1.5">
				<p class="lexend-regular">Water Quality</p>
				<p class="text-[40px] mt-[-13px] lexend-bold {waterStatusClass}">{waterStatus}</p>
			</div>

			<div class="flex flex-wrap justify-center sm:space-x-25 space-y-6.5 sm:space-y-0">
				<div class="flex flex-col items-center space-y-1.5">
					<p class="lexend-regular">pH Level</p>
					<p class="text-[40px] mt-[-13px] lexend-bold">{currentPh.toFixed(1) ?? "N/A"}</p>
					<!-- 
						<Bar />
					-->
					<div class="w-50 h-2.5 bg-gray-100 rounded-sm border-1 border-gray-200"></div>
					<p class="text-sm lexend-semibold {phStatus.toLowerCase()}">{phStatus}</p>
				</div>

				<div class="flex flex-col items-center space-y-1.5">
					<p class="lexend-regular">Turbidity</p>
					<p class="text-[40px] mt-[-13px] lexend-bold">{currentTurbidity.toFixed(1) ?? 'N/A'}</p>
					<!-- 
						<Bar />
					-->
					<div class="w-50 h-2.5 bg-white rounded-sm border-1 border-gray-200"></div>
					<p class="text-sm lexend-semibold {turbidityStatus.toLowerCase()}">{turbidityStatus}</p>
				</div>
			</div>

			<div class="w-full flex flex-row justify-center">
				<p class="text-gray-400 text-[12px]">
				Last updated: 
				{#if $lastUpdated || reading.created_at}
					{DateTime.fromISO($lastUpdated ?? reading.created_at, { zone: 'utc' })
						.setZone('Asia/Manila')
						.toFormat('MMMM d, yyyy hh:mm:ss a')}
				{:else}
					N/A
				{/if}
				</p>
			</div>
		</div>
	</div>
	
	<br>

	<div class="bg-gray-50 flex flex-col">
		<p class="text-[22px] lexend-semibold text-white rounded-t-md bg-sky-600 px-5 py-2">Historical data</p>
	
		<div class="border-b-2 border-x-2 border-gray-200 w-full flex flex-col items-center justify-center rounded-b-md p-5 space-y-6.5 lexend-regular">
			<div class="flex flex-row space-x-2.5 items-center justify-center">
				<p >Date filter: </p>
				<input type="date" bind:value={dateFilter} class="bg-neutral-100 border-1 border-gray-200 rounded-sm text-xs text-gray-700 px-3 py-1.5" />
			</div>
			<div class="flex flex-wrap sm:space-x-50 items-center justify-center space-y-6.5 sm:space-y-0">
				<div class="flex flex-col items-center space-y-1.5">
					<p>pH Level</p>
					<canvas use:chartRender={phChart} class="max-h-80 w-full sm:w-100"></canvas>
				</div>

				<div class="flex flex-col items-center space-y-1.5">
					<p>Turbidity</p>
					<canvas use:chartRender={turbChart}  class="max-h-80 w-full sm:w-100"></canvas>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.acidic { color: red; }
	.neutral { color: black; }
	.basic { color: blue; }
	.unsafe { color: red; }
	.stress { color: orange; }
	.safe { color: green; }
	.wssafe { color: green; }
  	.wsunsafe { color: #d1001f; }
</style>

