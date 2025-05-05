<script lang="ts">
	export let data;
	const { reading, phValues, turbValues, dates } = data;

	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { createClient } from '@supabase/supabase-js';
	import { chartRender } from '$lib/chartRender.js';
	import { BarData } from '$lib/chartData';
	import Bar from '$lib/Bar.svelte'	
  
	const supabase = createClient(
	  PUBLIC_SUPABASE_URL,
	  PUBLIC_SUPABASE_ANON_KEY
	);
  
	const ph = writable<Number | null>(null);
	const turbidity = writable<Number | null>(null);
	const lastUpdated = writable<string | null>(null);
  
	onMount(() => {
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

	
	$: currentPh = $ph ?? reading.ph;

	$: phStatus =
		currentPh === undefined || currentPh === null
		? "N/A"
		: currentPh === 7
		? "Neutral"
		: currentPh < 7
		? "Acidic"
		: "Basic";

	$: currentTurbidity = $turbidity ?? reading.turbidity;

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

</script>

<title>SOWQMS</title>


<div class="bg-blue-500 flex flex-row justify-center rounded-b-md p-5">
	<div class="flex flex-row space-x-2 items-center">
		<div class="w-10 h-10 rounded-full bg-neutral-300"></div>
		<p class="text-sm text-bold text-white">Smart Open Water Quality Monitoring System</p>
	</div>
</div>

<div class="py-5 px-7.5 space-y-2">

<p class="text-[25px] font-semibold">Current readings</p>
<div class="bg-gray-100 border-2 border-gray-200 w-full flex flex-col items-center justify-center rounded-md p-5 space-y-6.5">
	<div class="flex flex-col items-center space-y-1.5">
		<p>Water Quality</p>
		<p class="text-[40px] mt-[-13px] font-bold">SAFE</p>
	</div>

	<div class="flex flex-wrap justify-center sm:space-x-25 space-y-6.5 sm:space-y-0">
		<div class="flex flex-col items-center space-y-1.5">
			<p>pH Level</p>
			<p class="text-[40px] mt-[-13px] font-bold">{currentPh ?? "N/A"}</p>
			<!-- 
				<Bar />
			-->
			<div class="w-50 h-2.5 bg-white rounded-sm border-1 border-gray-200"></div>
			<p class="text-sm font-semibold {phStatus.toLowerCase()}">{phStatus}</p>
		</div>

		<div class="flex flex-col items-center space-y-1.5">
			<p>Turbidity</p>
			<p class="text-[40px] mt-[-13px] font-bold">{currentTurbidity ?? 'N/A'}</p>
			<div class="w-50 h-2.5 bg-white rounded-sm border-1 border-gray-200"></div>
			<p class="text-sm font-semibold {turbidityStatus.toLowerCase()}">{turbidityStatus}</p>
		</div>
	</div>

	<div class="w-full flex flex-row justify-center">
		<p class="text-gray-400 text-[12px]">Last updated: {$lastUpdated ?? reading.created_at ?? 'N/A'}</p>
	</div>
</div>

<p class="text-[25px] font-semibold">Historical data</p>
<div class="bg-gray-100 border-2 border-gray-200 w-full flex flex-col items-center justify-center rounded-md p-5 space-y-6.5">
	<div class="flex flex-wrap justify-center sm:space-x-20 space-y-6.5 sm:space-y-0">
		<div class="flex flex-col items-center space-y-1.5">
			<p>pH Level</p>
			<canvas use:chartRender={BarData('pH level', dates, phValues, 'rgba(115, 90, 145, 0.8)')} class="max-h-80 w-90"></canvas>
		</div>

		<div class="flex flex-col items-center space-y-1.5">
			<p>Turbidity</p>
			<canvas use:chartRender={BarData('turbidity', dates, turbValues, 'rgba(90, 145, 90, 0.8)')}  class="max-h-80 w-90"></canvas>
		</div>
	</div>
</div>

</div>

<style>
	.acidic { color: red; }
	.neutral { color: gray; }
	.basic { color: blue; }
	.unsafe { color: red; }
	.stress { color: orange; }
	.safe { color: green; }
</style>

