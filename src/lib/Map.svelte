<script lang="ts">
  import { onMount } from 'svelte';
  import maplibregl from 'maplibre-gl';

  let mapContainer: HTMLDivElement;

  export let markers;
  export let selectedLoc: string | null = null;
  export let selectedID: string | null = null;

  onMount(() => {
    const map = new maplibregl.Map({
      container: mapContainer,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [121.0437, 14.6760],
      zoom: 11,
    });

    map.addControl(new maplibregl.NavigationControl());

    markers.forEach(({ lng, lat, name, href }) => {
      const marker = new maplibregl.Marker({ color: '#FF0000' })
        .setLngLat([lng, lat])
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        selectedLoc = name;
        selectedID = href;
      });
    });
  });
</script>


<style>
  .map-container {
    height: 100%;
    width: 100%;
  }
</style>

<div bind:this={mapContainer} class="map-container"></div>
