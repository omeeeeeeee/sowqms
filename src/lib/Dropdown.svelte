<script>
  export let selected = '';
  export let options = [];
</script>

<form class="max-w-full mx-auto">
  <!--
  <label for="stations" class="block mb-2 text-sm font-medium text-gray-900">
    Select location
  </label>
  -->

  <div class="flex items-center space-x-2">
    <select
      id="stations"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-[13px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      bind:value={selected}
    >
      {#each options as { id, location }, i}
        {#if i === 0}
          <option value={id} selected>{location}</option>
        {:else}
          <option value={id}>{location}</option>
        {/if}
      {/each}
    </select>
  </div>
</form>