<script lang="ts">
	export let data;
	const { reading, phValues, turbValues, dates } = data;

	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { createClient } from '@supabase/supabase-js';
  
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
		<p>pH Level</p>
		<p class="text-[40px] mt-[-13px] font-bold">{$ph ?? reading.ph ?? "Waiting..."}</p>
		<div class="w-50 h-2.5 bg-white rounded-sm border-1 border-gray-200"></div>
		<p class="text-sm">neutral</p>
	</div>

	<div class="flex flex-col items-center space-y-1.5">
		<p>Turbidity</p>
		<p class="text-[40px] mt-[-13px] font-bold">{$turbidity ?? reading.turbidity ??'Waiting...'}</p>
		<div class="w-50 h-2.5 bg-white rounded-sm border-1 border-gray-200"></div>
		<p class="text-sm">low</p>
	</div>
	<p>Last updated: {$lastUpdated ?? reading.created_at ?? 'Waiting...'}</p>
</div>

<p class="text-[25px] font-semibold">Historical data</p>
<div class="bg-gray-100 border-2 border-gray-200 w-full flex flex-col items-center justify-center rounded-md p-5 space-y-6.5">
	<div class="flex flex-col items-center space-y-1.5">
		<p>pH Level</p>
		<p>*insert chart here*</p>
	</div>

	<div class="flex flex-col items-center space-y-1.5">
		<p>Turbidity</p>
		<p>*insert chart here*</p>
	</div>
</div>

</div>

