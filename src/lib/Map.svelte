<script lang="ts">
  import { onMount } from 'svelte';
  import maplibregl from 'maplibre-gl';
  import jQuery from 'jquery'

  let mapContainer: HTMLDivElement;

  export let markers;
  export let selected = null;
  export let zoomed = false;

	const markerRefs = new Map<string, maplibregl.Marker>();
	let currentId: string | null = null; 

  function setMarkerColor(marker, color) {
    var $elem = jQuery(marker.getElement());
    $elem.find('svg g[fill="' + marker._color + '"]').attr('fill', color);
    marker._color = color;
  }

  $: {
		if (selected === null && currentId) {
			markerRefs.forEach((m) => {
				setMarkerColor(m, '#FF0000')
        currentId = null;
			});
		} 
	}

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

      markerRefs.set(href, marker);

      marker.getElement().addEventListener('click', () => {
        // when marker is selected again, deselect
        if (marker._color != '#FF0000') {
          selected = null;
          currentId = null;
          setMarkerColor(marker, '#FF0000');
				}

        // new marker is selected
        else {
          // deselect previous marker
          if (currentId && markerRefs.has(currentId)) {
            setMarkerColor(markerRefs.get(currentId)!, '#FF0000');
				  }

          selected = { name: name, addr: addr, id: href };
          currentId = href;
          setMarkerColor(marker, '#00b357');
        }
      });

      bounds.extend([lng, lat]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: zoomed ? 10 : 75,    
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
