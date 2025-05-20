<script lang="ts">
  import { goto } from '$app/navigation';

  const teamMems = [
    { name: "Shane Odhuno", role: "Project Manager", pic: "https://eupfesgmnanqwfdfmnaw.supabase.co/storage/v1/object/public/homepage//Shane%20Pic.jpg" },
    { name: "Ramon Comendador Jr.", role: "Firmware Team", pic: "" },
    { name: "Jakin Bacalla", role: "Firmware Team", pic: "" },
    { name: "Seth Eliserio", role: "Frontend Developer", pic: "https://eupfesgmnanqwfdfmnaw.supabase.co/storage/v1/object/public/homepage//Eliserio,%20Seth%20Michael%20R._54917.jpg" },
    { name: "Anton Gosiengfiao", role: "Backend Developer", pic: "https://eupfesgmnanqwfdfmnaw.supabase.co/storage/v1/object/public/homepage//Anton%20Formal%20Pic.jpg" },
    { name: "Naomi Amparo", role: "Backend Developer", pic: "https://eupfesgmnanqwfdfmnaw.supabase.co/storage/v1/object/public/homepage//Naomi%20Formal%20Pic.jpg" },
  ];
</script>

<div class="relative overflow-hidden">
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
      style="background-image: url('https://images.pexels.com/photos/40784/drops-of-water-water-nature-liquid-40784.jpeg?cs=srgb&dl=pexels-pixabay-40784.jpg&fm=jpg'); top: -20px;"
    >
      <div class="absolute inset-0 bg-black/50"></div>
    </div>
  
    <div class="relative z-10 flex flex-col items-center justify-center text-white px-5 py-20 space-y-5">
      <img src="/src/lib/icons/icon.png" alt="logo.png" class="w-25 h-25 mb-0" />  
      <p class="lexend-bold text-[36px] text-center">LiniSense</p>
      <p class="inter-regular text-center max-w-xl">
        Real-time monitoring of pH and turbidity in Philippine waterways. Promoting transparency,
        safety, and sustainability.
      </p>
      <button
        class="bg-white text-sky-700 font-semibold px-5 py-2 rounded-md hover:bg-slate-100 transition"
        on:click={() => goto('/map')}
      >
        {@html "View map"}
      </button>
    </div>
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
    <p class="inter-regular max-w-3xl text-center">
      This platform was developed by BS Computer Science students of University of the Philippines - Diliman in fulfillment of the capstone project 
      for CS 145: Computer Networks. 
    </p>
  </div>
</div>

<div class="bg-gray-100 text-sky-900 py-10 px-7.5">
    <div class="flex flex-col items-center space-y-1.5">
      <p class="inter-semibold text-[22px]">Meet the Team</p>
      <div class="flex flex-wrap justify-center gap-x-12 gap-y-10 mt-5">
        {#each teamMems as mem}
          <div class="flex flex-col items-center space-y-1.5 w-36 text-center">
            {#if mem.pic}
              <img class="w-24 h-24 bg-cover rounded-full" src="{mem.pic}" alt="img" />
            {:else}
              <div class="w-24 h-24 bg-gray-300 rounded-full"></div>
            {/if}
            <p class="inter-semibold space-y-[5px]">{mem.name}</p>
            <p class="inter-regular text-sm">{mem.role}</p>
          </div>
        {/each}
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
</style>
