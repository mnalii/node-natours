/* eslint-disable */

// console.log(locations);

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW5hbGkyMjA1OTQiLCJhIjoiY2tsNXhpd3FjMmJpZjJwcW9jd2NpcnN1ZyJ9.CkP_2SuQJuHZTytz-Qdfmw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mnali220594/ckl5xwbxo4sld17tjyvr4qndz',
    scrollZoom: false

    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-right');

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
