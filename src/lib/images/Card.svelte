<script>
	export let name = "Paolo de los Santos";
	export let src = "";
</script>

<div class="flex flex-col items-center justify-center space-y-2 mx-5 my-8 rounded-sm border-sm border-gray-400">
	<!-- img  -->
	<img class="h-48 w-48 rounded-full object-cover" src={src} alt="img" />
	<p class="text-sm">{name}</p>
</div>