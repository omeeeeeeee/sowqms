<script>
  export let text = "text!";
</script>

<span class="relative inline-block group ml-2 align-middle">
  <span class="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-gray-500 rounded-full cursor-default">
    ?
  </span>
  <div class="absolute z-10 hidden w-max max-w-md px-3 py-2 text-sm text-white bg-gray-700 rounded shadow-md -top-9 left-1/2 -translate-x-1/2 group-hover:block break-words text-center">
    {@html text}
  </div>
</span>
