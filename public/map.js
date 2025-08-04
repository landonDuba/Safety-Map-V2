let map, directionsService, directionsRenderer;

//Initalize the map at Norfolk, VA and add autocomplete for searches
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 36.8508, lng: -76.2859 }, // Norfolk, VA
    zoom: 13,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  autocompleteStart = new google.maps.places.Autocomplete(document.getElementById("start"));
  autocompleteEnd = new google.maps.places.Autocomplete(document.getElementById("end"));
}

//Get the route from Google Maps API and display it
function calculateRoute() {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!start || !end) {
    alert("Please enter both start and end locations.");
    return;
  }

  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
    provideRouteAlternatives: false, //switch for many routes
  };

  directionsService.route(request, function(result, status) {
  if (status === "OK") {
    // Clear previous renderers
    if (window.renderers) {
      window.renderers.forEach(r => r.setMap(null));
    }
    window.renderers = [];

    result.routes.forEach((route, index) => {
      const renderer = new google.maps.DirectionsRenderer({
        map: map,
        directions: result,
        routeIndex: index,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: index === 0 ? "#1864c7ff" : "#ff6600", // green for primary, orange for alt
          strokeWeight: 5,
        }
      });

      window.renderers.push(renderer);

      // Optionally send each route to the backend
      if (index === 0) {
        sendRouteToBackend(route.overview_path);
      }
    });
  } else {
    alert("Could not calculate route: " + status);
  }
});

}

function sendRouteToBackend(path) {
  const routeCoords = path.map(coord => ({
    lat: coord.lat(),
    lng: coord.lng()
  }));

  fetch("http://localhost:5000/route", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ route: routeCoords })
})
.then(res => res.json())
.then(data => {
    avgScore = data.average_safety_score;
    const scoreSpot = document.getElementById("scoreSpot");
      if (avgScore !== null) {
        scoreSpot.textContent = avgScore.toFixed(2);
      } else {
        scoreSpot.textContent = "No score available";
      }

  // Assuming you’re using Google Maps DirectionsRenderer:
  directionsRenderer.setOptions({
    polylineOptions: {
      strokeWeight: 5
    }
  });
});

}
