<script>
    let { children } = $props();

	import { page } from '$app/state';
	import { goto } from '$app/navigation';
    import "../app.css";
	import IconHome from '$lib/icons/IconHome.svelte';
	import IconMap from '$lib/icons/IconMap.svelte';

	let routes = [
		{ name: "Home", href: "/", icon: IconHome },
		{ name: "Map", href: "/map", icon: IconMap },
	];

	const isCurrent = (href) => page.url.pathname === href;

</script>

<title>LiniSense</title>

{#if routes.reduce((acc, r) => acc && !isCurrent(r.href), true)}
	<button
	aria-label="go-back"
	type="button"
	class="absolute top-4 left-4 text-white px-4 py-2 rounded hover:bg-sky-700 z-50"
	onclick={() => history.length > 1 ? history.back() : goto('/map')}
	>
		<svg id='Back_24' width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='24' height='24' stroke='none' fill='#ffffff' opacity='0'/>
			<g transform="matrix(1.65 0 0 1.65 12 12)" >
				<path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" translate(-10.71, -12)" d="M 13 5.9296875 L 6.9296875 12 L 13 18.070312 L 14.5 16.570312 L 9.9296875 12 L 14.5 7.4296875 L 13 5.9296875 z" stroke-linecap="round" />
			</g>
		</svg>
	</button>
{/if}

<div class="min-h-screen bg-gray-100">	
	<div class="bg-sky-600 flex flex-row justify-center p-4 pr-6.5">
		<div class="flex flex-row space-x-2 items-center">
			<div class="w-10 h-10 rounded-full bg-neutral-300"></div>
			<p class="text-[25px] lexend-bold text-white">LiniSense</p>
		</div>
	</div>

	<div class="bg-sky-700 flex flex-row items-center justify-start w-full pr-5">
		{#each routes as route}
			<a class="{isCurrent(route.href) ? "bg-gray-100 text-black" : "text-white"} hover:text-black hover:bg-sky-400 pl-4 pr-5 py-2 inter-regular flex flex-row" href={route.href}>
				<div class="flex flex-row items-center justify-center space-x-1.5">
					<route.icon />
					<p>{route.name}</p>
				</div>
			</a>
		{/each}
	</div>
	
	


	{@render children()}
</div>
  