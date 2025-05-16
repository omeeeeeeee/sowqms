<script>
    let { children } = $props();
    import "../app.css";
  </script>

<title>SOWQMS</title>

<div class="bg-blue-500 flex flex-row justify-center rounded-b-md p-5">
	<div class="flex flex-row space-x-2 items-center">
		<div class="w-10 h-10 rounded-full bg-neutral-300"></div>
		<p class="text-sm text-bold text-white">Smart Open Water Quality Monitoring System</p>
	</div>
</div>

{@render children()}

  