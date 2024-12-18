//Reference: https://openweathermap.org/widgets-constructor

import API_KEYS from "./keys.js";

const widgetContainer = document.getElementById("openweathermap-widget-11");

export async function fetchCityId(cityName) {
  const apiKey = `${API_KEYS.OPENWEATHER_API_KEY}`;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    cityName
  )}&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    return data.id; // Returns the city ID
  } catch (error) {
    console.error("Error fetching city ID:", error);
    return null;
  }
}

export function loadWeatherWidget(cityId) {
  if (!cityId) {
    widgetContainer.innerHTML =
      "<p class='error'>City not found. Please try again.</p>";
    return;
  }

  widgetContainer.innerHTML = "";

  // Screen size detection for responsive widgets
  const widgetId = window.innerWidth <= 768 ? 15 : 11; // Widget-15 for small screens, Widget-11 for large screens

  window.myWidgetParam = [];
  window.myWidgetParam.push({
    id: widgetId,
    cityid: cityId,
    appid: `${API_KEYS.OPENWEATHER_API_KEY}`,
    units: "metric",
    containerid: "openweathermap-widget-11",
  });

  const script = document.createElement("script");
  script.async = true;
  script.charset = "utf-8";
  script.src =
    "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
  document.body.appendChild(script);
}

// Monitor window resize to switch the widget dynamically
export function responsiveWidget(cityId) {
  window.addEventListener("resize", () => {
    loadWeatherWidget(cityId);
  });
}
