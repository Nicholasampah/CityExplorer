import API_KEYS from "./keys.js"; //Importing API keys
import{ loadGoogleMapsAPI} from "./google_maps.js"; 


// Fetching the navigation menu 
fetch("components/nav.html") // Sends a request to fetch the HTML content of the navigation bar
  .then((response) => response.text()) // Converts the response to text format
  .then((data) => {
    document.getElementById("navbar").innerHTML = data; // Inserts the fetched HTML into the element with id "navbar"
  })
  .catch((error) => console.error("Error loading navbar:", error)); // Logs an error if the fetch request fails



const detailsContainer = document.getElementById("details");

const params = new URLSearchParams(window.location.search);
const city = params.get("city");
const country = params.get("country");

if (!city || !country) {
  detailsContainer.innerHTML = "<p>Invalid city or country.</p>";
} else {
  fetchDetails(city, country);
}

async function fetchDetails(city, country) {
  try {
    detailsContainer.innerHTML = "<p class='loading'>Loading details...</p>";

    // Fetch details from APIs
    const [populationData, flagData, currencyData, mapData] = await Promise.all(
      [
        fetch(`https://countriesnow.space/api/v0.1/countries/population`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, country }),
        }).then((res) => res.json()),

        fetch("https://countriesnow.space/api/v0.1/countries/flag/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        }).then((res) => res.json()),

        fetch("https://countriesnow.space/api/v0.1/countries/currency", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        }).then((res) => res.json()),

        fetch(
          `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?address=${encodeURIComponent(
            city
          )},${encodeURIComponent(
            country
          )}&language=en&region=en&result_type=administrative_area_level_1&location_type=APPROXIMATE`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": `${API_KEYS.RAPID_API_KEY}`,
              "x-rapidapi-host": "google-map-places.p.rapidapi.com",
            },
          }
        ).then((res) => res.json()),
      ]
    );

    // Validate and process responses
    if (!populationData.data) throw new Error("Population data not found.");
    if (!flagData.data) throw new Error("Flag data not found.");
    if (!currencyData.data) throw new Error("Currency data not found.");
    // Extract data
    const population = populationData.data.populationCounts[0].value || "N/A";
    const flag = flagData.data?.flag || "";
    const currency = currencyData.data?.currency || "N/A";
    const mapLocation = mapData?.results?.[0]?.geometry?.location || null;

    //  details
    // Update the DOM
    detailsContainer.innerHTML = `
   <div class="city-info">
     <img src="${flag}" alt="Flag of ${country}" class="flag">
     <p class="info"><strong>City:</strong> ${city}</p>
     <p class="info"><strong>Country:</strong> ${country}</p>
     <p class="info"><strong>Population:</strong> ${population}</p>
     <p class="info"><strong>Currency:</strong> ${currency}</p>
   </div>
   <div id="openweathermap-widget-11"></div>
   <div id="map"></div>
   `;

   // Initialize map if location is available
   if (mapLocation) {
    loadGoogleMapsAPI().then(() => initializeMap(mapLocation));
  } else {
    document.getElementById("map").innerHTML =
      "<p>Map data not available.</p>";
  }

  } catch (error) {
    console.error("Error fetching details:", error);
    detailsContainer.innerHTML =
      "<p>Failed to load details. Please try again later.</p>";
  }
}

// Function to initialize Google Map
function initializeMap(location) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 12,
  });

  new google.maps.Marker({
    position: location,
    map: map,
    title: `${city}, ${country}`,
  });
}
