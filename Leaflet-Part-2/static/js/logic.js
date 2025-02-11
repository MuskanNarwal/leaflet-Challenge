// Define the API endpoint
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 4; // Adjust size multiplier as needed
}

// Function to determine marker color based on depth
function getColor(depth) {
    return depth > 100 ? '#FF0000' : // Red for depth > 100 km
           depth > 50  ? '#FF7F00' : // Orange for depth > 50 km
           depth > 20  ? '#FFFF00' : // Yellow for depth > 20 km
           depth > 0   ? '#7FFF00' : // Light green for depth > 0 km
                         '#00FF00';  // Green for depth <= 0 km
}

// Perform a GET request to the query URL
fetch(queryUrl)
    .then(response => response.json())
    .then(data => createMap(data.features));

// Create the map
function createMap(earthquakeData) {
    // Create the base layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    // Create the map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street]
    });

    // Create a GeoJSON layer and add it to the map
    earthquakeData.forEach(earthquake => {
        let coordinates = earthquake.geometry.coordinates;
        let magnitude = earthquake.properties.mag;
        let depth = coordinates[2];

        // Create a circle marker
        L.circleMarker([coordinates[1], coordinates[0]], {
            radius: markerSize(magnitude),
            fillColor: getColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`<strong>Location:</strong> ${earthquake.properties.place}<br>
                      <strong>Magnitude:</strong> ${magnitude}<br>
                      <strong>Depth:</strong> ${depth} km`)
        .addTo(myMap);
    });

    // Create a legend
    createLegend();
}

// Create a legend for the map
function createLegend() {
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'legend');
        let depths = [-10, 10, 30, 50, 70, 90];
        div.innerHTML += '<strong>Depth (km)</strong><br>';
        div.innerHTML += '<i style="background: #FF0000"></i><span>> 100</span><br>';
        div.innerHTML += '<i style="background: #FF7F00"></i><span>50 - 100</span><br>';
        div.innerHTML += '<i style="background: #FFFF00"></i><span>20 - 50</span><br>';
        div.innerHTML += '<i style="background: #7FFF00"></i><span>0 - 20</span><br>';
        div.innerHTML += '<i style="background: #00FF00"></i><span>Negative Depth</span><br>';
        return div;
    };

    legend.addTo(myMap);
}
