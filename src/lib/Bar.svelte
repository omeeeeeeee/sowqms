<script>
  export let segments = 14;
  export let selected = 1;
</script>

<div class="relative w-75 h-2.5 bg-white rounded-sm border border-gray-200">
  {#each Array(segments - 1) as _, i}
    <div
      class="absolute top-0 bottom-0 w-[1px] bg-gray-300"
      style="left: {(100 / segments) * (i + 1)}%;">
    </div>
    {#if i < selected}
      <div
        class="absolute top-0 bottom-0 w-7.5 bg-blue-200"
        style="left: {(100 / segments) * (i + 1)}%;">
      </div>
    {/if}
  {/each}
</div>
