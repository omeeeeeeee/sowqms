<script lang="ts">
  import { onMount } from 'svelte';
  import maplibregl from 'maplibre-gl';

  let mapContainer: HTMLDivElement;

  export let markers;
  export let selected = null;

  onMount(() => {
    const map = new maplibregl.Map({
      container: mapContainer,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [0, 0],
      zoom: 11,
    });

    map.addControl(new maplibregl.NavigationControl());
    const bounds = new maplibregl.LngLatBounds();

    markers.forEach(({ lng, lat, name, addr, href }) => {
      const marker = new maplibregl.Marker({ color: '#FF0000' })
        .setLngLat([lng, lat])
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        selected = { name: name, 
                     addr: addr,
                     id: href,
                   };
      });

      bounds.extend([lng, lat]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: 100,    
        maxZoom: 14,    
        duration: 0     
      });
	  }
  });
</script>


<style>
  .map-container {
    height: 100%;
    width: 100%;
  }
</style>

<div bind:this={mapContainer} class="map-container"></div>
