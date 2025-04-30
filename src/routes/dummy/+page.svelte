<script>
	import { chartRender } from '$lib/chartRender.js';
	import { BarData } from '$lib/chartData.js';
</script>

<div class="w-2/5 h-44 border m-auto">
	<canvas use:chartRender={BarData}></canvas>
</div>