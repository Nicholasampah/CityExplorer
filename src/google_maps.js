//Reference: Youtube 
import API_KEYS from "./keys.js";

// Function to load Google Maps script dynamically
export function loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
      if (document.getElementById("google-maps-script")) {
        resolve(); // Script already loaded
        return;
      }
  
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_API_KEY}`;
      script.async = true;
      script.defer = true;
  
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
  
      document.body.appendChild(script);
    });
  }