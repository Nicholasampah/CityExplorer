import API_KEYS from "./keys.js"; // Importing API keys
import { loadGoogleMapsAPI } from "./google_maps.js"; // Import function to load Google Maps API
import { fetchCityId, loadWeatherWidget, responsiveWidget } from "./weather_widget.js"; // Import functions for weather widget functionality

// Fetching the navigation menu
fetch("nav.html") // Sends a request to fetch the HTML content of the navigation bar
  .then((response) => response.text()) // Converts the response to text
  .then((data) => {
    document.getElementById("navbar").innerHTML = data; // Injects the fetched HTML into the "navbar" element
  })
  .catch((error) => console.error("Error loading navbar:", error)); // Logs an error if the fetch fails

// Get reference to the container where city details will be displayed
const detailsContainer = document.getElementById("details");

// Extract query parameters (city and country) from the URL
const params = new URLSearchParams(window.location.search); // Parses the query string in the URL
const city = params.get("city"); // Retrieves the "city" parameter from the URL
const country = params.get("country"); // Retrieves the "country" parameter from the URL

// Check if city or country is missing
if (!city || !country) {
  detailsContainer.innerHTML = "<p>Invalid city or country.</p>"; // Display an error message
} else {
  fetchDetails(city, country); // Fetch city details if parameters are valid
}

// Function to fetch city details
async function fetchDetails(city, country) {
  try {
    detailsContainer.innerHTML = "<p class='loading'>Loading details...</p>"; // Display loading message

    // Fetch data from multiple APIs in parallel
    const [populationData, flagData, currencyData, mapData] = await Promise.all([
      // Fetch population data
      fetch(`https://countriesnow.space/api/v0.1/countries/population/cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, country }), // Send city and country as JSON
      }).then((res) => res.json()), // Convert response to JSON

      // Fetch country flag data
      fetch("https://countriesnow.space/api/v0.1/countries/flag/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }), // Send country as JSON
      }).then((res) => res.json()), // Convert response to JSON

      // Fetch country currency data
      fetch("https://countriesnow.space/api/v0.1/countries/currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }), // Send country as JSON
      }).then((res) => res.json()), // Convert response to JSON

      // Fetch map location data from Google API
      fetch(
        `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?address=${encodeURIComponent(
          city
        )},${encodeURIComponent(country)}&language=en&region=en&result_type=administrative_area_level_1&location_type=APPROXIMATE`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": `${API_KEYS.RAPID_API_KEY}`, // API key for Google Maps
            "x-rapidapi-host": "google-map-places.p.rapidapi.com",
          },
        }
      ).then((res) => res.json()), // Convert response to JSON
    ]);

    // Validate and process responses
    if (!populationData.data) throw new Error("Population data not found.");
    if (!flagData.data) throw new Error("Flag data not found.");
    if (!currencyData.data) throw new Error("Currency data not found.");

    // Extract relevant data
    const population = populationData.data.populationCounts[0].value || "N/A"; // Get population or "N/A"
    const flag = flagData.data?.flag || ""; // Get flag URL or empty string
    const currency = currencyData.data?.currency || "N/A"; // Get currency or "N/A"
    const mapLocation = mapData?.results?.[0]?.geometry?.location || null; // Extract map location data

    // Update the DOM with fetched details
    detailsContainer.innerHTML = `
      <div class="city-info">
        <img src="${flag}" alt="Flag of ${country}" class="flag"> <!-- Display flag image -->
        <p class="info"><strong>City:</strong> ${city}</p>
        <p class="info"><strong>Country:</strong> ${country}</p>
        <p class="info"><strong>Population:</strong> ${population}</p>
        <p class="info"><strong>Currency:</strong> ${currency}</p>
      </div>
      <div id="openweathermap-widget-11"></div> <!-- Placeholder for weather widget -->
      <div id="map"></div> <!-- Placeholder for map -->
    `;

    // Initialize Google Map if location data is available
    if (mapLocation) {
      loadGoogleMapsAPI().then(() => initializeMap(mapLocation)); // Load and initialize the map
    } else {
      document.getElementById("map").innerHTML =
        "<p>Map data not available.</p>"; // Display an error if map data is missing
    }

    // Fetch and display weather widget
    const cityId = await fetchCityId(city); // Get the city ID for weather widget
    if (cityId) {
      loadWeatherWidget(cityId); // Load the weather widget
      responsiveWidget(cityId); // Make the weather widget responsive
    }
  } catch (error) {
    console.error("Error fetching details:", error); // Log an error if fetching fails
    detailsContainer.innerHTML =
      "<p>Failed to load details. Please try again later. This application can only retrieve data for cities</p>"; // Display error message
  }
}

// Function to initialize Google Map
function initializeMap(location) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: location, // Center the map on the given location
    zoom: 10, // Set zoom level
  });

  new google.maps.Marker({
    position: location, // Place a marker at the location
    map: map, // Attach the marker to the map
    title: `${city}, ${country}`, // Set marker title
  });
}