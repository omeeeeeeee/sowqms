<script context="module">
  import Chart from 'chart.js';
</script>

<script>
  export let config;

  const handleChart = (element, config) => {
    let theChart = new Chart(element, config);

    return {
      update(newConfig) {
        theChart.destroy();
        theChart = new Chart(element, newConfig);
      },
      destroy() {
        theChart.destroy();
      }
    };
  };
</script>

<canvas use:handleChart={config} />
