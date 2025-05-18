<script>
    let { children } = $props();

	import { page } from '$app/state';
	import { get } from 'svelte/store';
    import "../app.css";

	let routes = [
		{ name: "Home", href: "/"},
		{ name: "Map", href: "/map"},
	];

	const isCurrent = (href) => page.url.pathname === href;

</script>

<title>LiniSense</title>

<div class="min-h-screen bg-gray-100">	
	<div class="bg-sky-600 flex flex-row justify-center p-4 pr-6.5">
		<div class="flex flex-row space-x-2 items-center">
			<div class="w-10 h-10 rounded-full bg-neutral-300"></div>
			<p class="text-[25px] lexend-bold text-white">LiniSense</p>
		</div>
	</div>

	<div class="bg-sky-700 flex flex-row items-center justify-start w-full pr-5">
		{#each routes as route}
			<a class="{isCurrent(route.href) ? "bg-gray-100 text-black" : "text-white"} hover:text-black hover:bg-sky-400 px-5 py-2 lexend-regular" href={route.href}>{route.name}</a>
		{/each}
	</div>

	{@render children()}
</div>
  