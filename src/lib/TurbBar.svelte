<script>
  export let selected = 10;

  const turbColors = [
    '#0068B8', '#1F9EFF', '#70C1FF', '#99D3FF'
  ];

  let colors;

  $: colors = selected <= 1
		? [...turbColors.slice(3), Array(3).fill('#ffffff')].flat()
		: selected <= 50	// double check? previously = 10
		? [...turbColors.slice(2), Array(2).fill('#ffffff')].flat()
		: selected <= 100
		? [...turbColors.slice(1), Array(1).fill('#ffffff')].flat()
		: turbColors
</script>

<div class="relative flex w-full h-6.5 border border-gray-300 rounded-lg">
  {#each colors as color, i}
    <div 
      class="flex-1 w-full {i === 0 ? "rounded-l-lg" : (i === 3 ? "rounded-r-lg" : color === "#ffffff" ? "border-r-1 border-gray-300" : "")}" 
      style="background-color: {color};"
    >
    </div>
    <!-- opacity: {i === Math.round(selected - 0.5) ? "100%" : "30%"} -->
  {/each}

  <!--
  <div
    class="absolute w-[4px] bg-gray-700 rounded-sm"
    style="
      height: 150%;
      top: -25%;
      left: {(selected / 5) * 100}%;
      transform: translateX(4px);
    "></div>
    -->
</div>


