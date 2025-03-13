// Create the map object
let myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
  });
  
  // Add the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Fetch the earthquake data
  let apiUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Define a function to determine marker size based on magnitude
  function markerSize(magnitude) {
    return magnitude * 4;
  }
  
  // Define a function to determine marker color based on depth
  function markerColor(depth) {
    if (depth > 90) return "#800026";
    if (depth > 70) return "#BD0026";
    if (depth > 50) return "#E31A1C";
    if (depth > 30) return "#FC4E2A";
    if (depth > 10) return "#FD8D3C";
    return "#FEB24C";
  }
  
  // Fetch data and add to the map
  d3.json(apiUrl).then(function (data) {
    // Loop through each feature in the dataset
    data.features.forEach(function (feature) {
      let coords = feature.geometry.coordinates;
      let magnitude = feature.properties.mag;
      let depth = coords[2];
      let place = feature.properties.place;
  
      // Add a circle marker to the map
      L.circleMarker([coords[1], coords[0]], {
        radius: markerSize(magnitude),
        fillColor: markerColor(depth),
        color: "#000",
        weight: 1,
        fillOpacity: 0.75
      }).bindPopup(
        `<h3>${place}</h3><hr><p>Magnitude: ${magnitude}</p><p>Depth: ${depth} km</p>`
      ).addTo(myMap);
    });
  
    // Add a legend to the map
    let legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
      let depths = [-10, 10, 30, 50, 70, 90];
      let colors = ["#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"];
  
      // Loop through depth intervals and generate a label with a colored square for each interval
      for (let i = 0; i < depths.length; i++) {
        div.innerHTML += `<i style="background: ${colors[i]}"></i> ${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] : "+"}<br>`;
      }
  
      return div;
    };
  
    legend.addTo(myMap);
  });
  