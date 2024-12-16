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
      ]
    );

    //  API response
    if (!populationData || !populationData.data) {
      throw new Error("Population data not found");
    }
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

  } catch (error) {
    console.error("Error fetching details:", error);
    detailsContainer.innerHTML =
      "<p>Failed to load details. Please try again later.</p>";
  }
}

