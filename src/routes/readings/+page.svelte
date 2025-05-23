  

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
	import { DateTime } from 'luxon';

	import Map from '$lib/Map.svelte';
	import PhBar from '$lib/PhBar.svelte';
	import TurbBar from '$lib/TurbBar.svelte';
	import Tooltip from '$lib/Tooltip.svelte';

	let offset = 0.0;

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
  
	let ph;
	const turbidity = writable<Number | null>(null);
	const lastUpdated = writable<string | null>(null);
  
	onMount(() => {
	  // const url = new URL(window.location.href);
      // const queryParams = new URLSearchParams(url.search);

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
			ph = row.ph;
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
	$: phChart = ChartData('pH level', dates, phValues.map(p => p - offset), 'rgba(115, 90, 145, 0.8)', dateFilter);

	let turbChart;
	$: turbChart = ChartData('Turbidity', dates, turbValues, 'rgba(90, 115, 145, 0.8)', dateFilter);
	
	$: currentPh = ph ? ph : (reading ? reading.ph : null);

	$: phStatus =
		currentPh === undefined || currentPh === null
		? "N/A"
		: Math.round((currentPh - offset)* 10) === 7 * 10
		? "Neutral"
		: Math.round((currentPh - offset)* 10) < 7 * 10
		? "Acidic"
		: "Basic";

	$: currentTurbidity = $turbidity ?? reading?.turbidity ?? null;

	// Ref: https://in-situ.com/en/faq/water-quality-information/turbidity-faqs/what-are-typical-turbidity-values-in-natural-environments?srsltid=AfmBOoqX5CR7qDVYosA1G-2JTLVTodYZz-X38FniG8vWrQ1wAvgPEFFp
	$: turbidityStatus =
	currentTurbidity === undefined || currentTurbidity === null
		? "N/A"
		: Math.round(currentTurbidity * 10) <= 1 * 10
		? "Safe (Drinking/Treated Water)"
		: Math.round(currentTurbidity * 10) <= 50 * 10	// double check? previously = 10
		? "Safe (Recreational Water e.g. Rivers and Lakes)"
		: Math.round(currentTurbidity * 10) <= 100 * 10
		? "Stressful to Aquatic Life"
		: "Unsafe for Aquatic Life";

	$: turbidityStatusClass =
		turbidityStatus.includes("Unsafe") ? "unsafe" :
		turbidityStatus.includes("Stressful") ? "stress" :
		turbidityStatus.includes("Safe") ? "safe" : "";

	$: waterStatus =
		currentPh === null || currentTurbidity === null
			? "Unknown"
			: (Math.round((currentPh - offset) * 10) >= 6.5 * 10 
				&& Math.round((currentPh - offset) * 10) <= 8.5 * 10 
				&& Math.round(currentTurbidity * 10) <= 50 * 10
			  ) // double check? previously = 10
			? "SAFE"
			: "UNSAFE";

	$: waterStatusClass =
		waterStatus === "SAFE" ? "wssafe" :
		waterStatus === "UNSAFE" ? "wsunsafe" : "";

	const qualityInfo = `The overall water quality is determined safe if the pH level is between 6.5 to 8.5 and the turbidity <= 50.`;
	const phInfo = `pH level measures how acidic or alkaline<br>the water is on a scale of 0 to 14. 
					<br> <br>
					pH = 7 is neutral <br>
					pH < 7 is acidic <br>
					pH > 7 is basic`;
	const turbInfo = `Turbidity measures cloudiness or haziness of the water.
					<br> <br>
					turbidity <= 1 is safe for drinking/treated water <br>
					turbidity <= 50 is safe for recreational purposes <br>
					turbidity <= 100 is stressful to aquatic life, <br>
					otherwise, unsafe for aquatic life`;
</script>

<div class="py-5 px-7.5 space-y-2">
	

	<div class="flex flex-col sm:flex-row h-auto max-h-100">
		<div class="flex flex-col items-center justify-center text-white rounded-t-md sm:rounded-r-none sm:rounded-l-md">
			<div class="h-full flex flex-col items-center justify-center text-white rounded-t-md sm:rounded-r-none sm:rounded-tl-md bg-sky-600 px-5 py-2">
				<p class="inter-semibold text-[30px]">{locName}</p>
				<p class="inter-regular text-center text-sm">{locAddress}</p>
			</div>

			<div class="h-full w-full bg-gray-50 flex flex-col justify-center items-center space-y-1.5 border-x-2 sm:rounded-bl-md sm:border-b-2 sm:border-l-2 border-gray-200 py-3.5">
				<div class="flex flex-row justify-center items-center">
					<p class="inter-regular text-black">Water Quality</p>
					<Tooltip text={qualityInfo} />
				</div>
				<p class="text-[40px] mt-[-13px] inter-bold {waterStatusClass}">{waterStatus}</p>
			</div>

		</div>

		<div class="h-75 w-full rounded-b-md sm:rounded-l-none sm:rounded-r-md border-2 sm:border-l-0 border-gray-200">
			<Map markers={marker} selected={selected} zoomed={true}/>
		</div>
	</div>

	<br>

	<div class="flex flex-col">
		<p class="text-[22px] inter-semibold text-white rounded-t-md bg-sky-600 px-5 py-2">Current readings</p>

		<div class="bg-gray-50 border-b-2 border-x-2 border-gray-200 w-full flex flex-col items-center justify-center rounded-b-md p-5 space-y-6.5">
			<div class="flex flex-wrap justify-center sm:space-x-25 space-y-6.5 sm:space-y-0">
				<div class="flex flex-col items-center space-y-1.5 w-65">
					<div class="flex flex-row justify-center items-center">
						<p class="inter-regular">pH Level</p>
						<Tooltip text={phInfo} />
					</div>
					<p class="text-[40px] mt-[-13px] inter-bold">{(currentPh - offset).toFixed(1) ?? "N/A"}</p>	
					<PhBar selected={Number(currentPh) - offset} />
					<p class="text-sm inter-semibold {phStatus.toLowerCase()}">{phStatus}</p>
				</div>

				<div class="flex flex-col items-center space-y-1.5 w-65">
					<div class="flex flex-row justify-center items-center">
						<p class="inter-regular">Turbidity</p>
						<Tooltip text={turbInfo} />
					</div>
					<p class="text-[40px] mt-[-13px] inter-bold">{currentTurbidity.toFixed(1) ?? 'N/A'}</p>
					<TurbBar selected={Number(currentTurbidity)} />
					<p class="text-sm inter-semibold text-center {turbidityStatus.toLowerCase()}">{turbidityStatus}</p>
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
		<p class="text-[22px] inter-semibold text-white rounded-t-md bg-sky-600 px-5 py-2">Historical data</p>
	
		<div class="border-b-2 border-x-2 border-gray-200 w-full flex flex-col items-center justify-center rounded-b-md p-5 space-y-6.5 inter-regular">
			<div class="flex flex-col space-y-1.5 items-center justify-center">
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

