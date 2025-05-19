<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  function goToMap() {
    goto('/map');
  }
</script>

<div class="flex flex-col items-center justify-center text-white rounded-md bg-sky-600 px-5 py-10 space-y-5">
  <p class="inter-bold text-[36px] text-center">LiniSense</p>
  <p class="inter-regular text-center max-w-xl">
    Real-time monitoring of pH and turbidity in Philippine waterways. Promoting transparency,
    safety, and sustainability.
  </p>
  <button
    class="bg-white text-sky-700 font-semibold px-5 py-2 rounded hover:bg-slate-100 transition"
    on:click={goToMap}
  >
    View Map
  </button>
</div>

<div class="py-10 px-7.5 space-y-8">
  <div class="flex flex-col items-center">
    <p class="inter-semibold text-[28px] text-center">How It Works</p>
    <p class="inter-regular text-center max-w-3xl mt-2">
      LiniSense collects real-time water quality readings from multiple sensor locations in the Philippines.
      Currently, we have sensors deployed in Manila, Makati, and Pasig.
    </p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
    <div class="p-5 border-2 rounded-md shadow bg-white">
      <p class="inter-semibold text-lg mb-2">Real-time Monitoring</p>
      <p class="inter-regular text-sm">Live updates of pH and turbidity from deployed sensors.</p>
    </div>
    <div class="p-5 border-2 rounded-md shadow bg-white">
      <p class="inter-semibold text-lg mb-2">Multi-Location Support</p>
      <p class="inter-regular text-sm">Track and compare readings across rivers and urban water systems.</p>
    </div>
  </div>
</div>

<div class="bg-sky-600 text-white py-10 px-7.5 mt-10">
  <div class="flex flex-col items-center">
    <p class="inter-semibold text-[22px] mb-2">About the Project</p>
    <p class="inter-regular max-w-2xl text-center">
      This platform was developed by BS Computer Science students of University of the Philippines Diliman in fulfillment of the class project 
      for CS 145: Computer Networks. 
    </p>
  </div>
</div>

<div class="bg-gray-100 text-sky-900 py-10 px-7.5">
  <div class="flex flex-col items-center space-y-4">
    <p class="inter-semibold text-[22px]">Meet the Team</p>
    <div class="flex flex-wrap justify-center gap-x-12 gap-y-10 mt-5">
      <div class="flex flex-col items-center space-y-2">
        <div class="w-24 h-24 bg-gray-300 rounded-full"></div>
        <p class="inter-semibold">Shane Odhuno</p>
        <p class="inter-regular text-sm text-center">Project Manager</p>
      </div>
      <div class="flex flex-col items-center space-y-2">
        <div class="w-24 h-24 bg-gray-300 rounded-full"></div>
        <p class="inter-semibold">Ramon Comendador</p>
        <p class="inter-regular text-sm text-center">Firmware Team</p>
      </div>
      <div class="flex flex-col items-center space-y-2">
        <div class="w-24 h-24 bg-gray-300 rounded-full"></div>
        <p class="inter-semibold">Jakin Bacalla</p>
        <p class="inter-regular text-sm text-center">Firmware Team</p>
      </div>
      <div class="flex flex-col items-center space-y-2">
        <div class="w-24 h-24 bg-gray-300 rounded-full"></div>
        <p class="inter-semibold">Seth Eliserio</p>
        <p class="inter-regular text-sm text-center">Frontend Developer</p>
      </div>
      <div class="flex flex-col items-center space-y-2">
        <div class="w-24 h-24 bg-gray-300 rounded-full"></div>
        <p class="inter-semibold">Anton Gosiengfiao</p>
        <p class="inter-regular text-sm text-center">Backend Developer</p>
      </div>
      <div class="flex flex-col items-center space-y-2">
        <div class="w-24 h-24 bg-gray-300 rounded-full"></div>
        <p class="inter-semibold">Naomi Amparo</p>
        <p class="inter-regular text-sm text-center">Backend Developer</p>
      </div>
    </div>
  </div>
</div>

<style>
  .inter-regular {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
  }
  .inter-semibold {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
  }
  .inter-bold {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
  }
</style>
