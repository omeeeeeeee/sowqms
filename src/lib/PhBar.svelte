<script>
  export let selected = 10;

  const phColors = [
    '#eb4021', '#ed6f41', '#f5b441', '#fbd74a', '#e1e74f',
    '#6cdd45', '#5cc73d', '#4fac30', '#51bb6e', '#5cccca',
    '#419ad4', '#3150d5', '#5232c1', '#692fb2', '#562794'
  ];
</script>

<div class="relative flex w-full h-6.5 border border-gray-300 rounded-lg">
  {#each phColors as color, i}
    <div 
      class="flex-1 w-full {i === 0 ? "rounded-l-lg" : (i === 14 ? "rounded-r-lg" : "")}" 
      style="background-color: {color};"
    >
    </div>
    <!-- opacity: {i === Math.round(selected - 0.5) ? "100%" : "30%"} -->
  {/each}

  <div
    class="absolute w-[4px] bg-gray-700 rounded-sm"
    style="
      height: 150%;
      top: -25%;
      left: {(selected / 15) * 100}%;
      transform: translateX(4px);
    "></div>
</div>


