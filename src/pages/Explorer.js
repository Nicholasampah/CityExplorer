import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Explorer = () => {
  const [query] = useSearchParams();
  const city = query.get("city");
  const country = query.get("country");

  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (city && country) {
      fetchDetails(city, country);
    }
  }, [city, country]);

  const fetchDetails = async (city, country) => {
    try {
      const [countryDetailsResponse, weatherResponse, flagResponse, currencyResponse, hotelsResponse] = await Promise.all([
        fetch(`https://countriesnow.space/api/v0.1/countries/population`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, country }),
        }).then((res) => res.json()),
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2ee960cf666a64a68a5c0ef987e1806c`)
          .then((res) => res.json()),
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
        fetch(`https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${city}`, {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "cfefdf80a6msh11a0a92beeff38bp1a61b9jsn07414ff6adbd", // Replace with your actual API key
            "X-RapidAPI-Host": "tripadvisor16.p.rapidapi.com",
          },
        }).then((res) => res.json()),
      ]);

      console.log("Country details response:", countryDetailsResponse);
      console.log("Weather response:", weatherResponse);
      console.log("Flag response:", flagResponse);
      console.log("Currency:", currencyResponse);
      console.log("Hotels response:", hotelsResponse);


      const countryDetails = countryDetailsResponse.data;
      const weatherData = weatherResponse;
      const flagData = flagResponse.data;
      const currencyData = currencyResponse.data
      const hotelsData = hotelsResponse.data; 

      setDetails({
        population: countryDetails?.populationCounts?.[0]?.value || "N/A",
        weather: weatherData.main
          ? {
              temperature: (weatherData.main.temp - 273.15).toFixed(1), // Convert Kelvin to Celsius
              description: weatherData.weather?.[0]?.description || "N/A",
            }
          : null,
        flag: flagData?.flag || "N/A",
        currency: currencyData?.currency || "N/A",
        hotels: hotelsData,

      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching details:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading details for {city}...</h2>;
  }

  return (
    <div>
    <h1>
      {city}, {country}
    </h1>
    {details.flag && (
      <div>
        {/* <strong>Flag:</strong> */}
        <img src={details.flag} alt={`${country} flag`} style={{ width: "400px", marginTop: "10px" }} />
      </div>
    )}
    <p><strong>Population:</strong> {details.population}</p>
    <p>
      <strong>Weather:</strong>{" "}
      {details.weather
        ? `${details.weather.temperature}°C, ${details.weather.description}`
        : "N/A"}
    </p>
    <p><strong>Currency: </strong>{details.currency}</p>
    {details.hotels?.length > 0 && (
        <div>
          <h2>Hotels</h2>
          <ul>
            {details.hotels.map((hotel, index) => (
              <li key={index}>
                <strong>{hotel.name}</strong>
                <p>{hotel.address}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Explorer;
