// Fetching the navigation menu 
fetch("components/nav.html") // Sends a request to fetch the HTML content of the navigation bar
  .then((response) => response.text()) // Converts the response to text format
  .then((data) => {
    document.getElementById("navbar").innerHTML = data; // Inserts the fetched HTML into the element with id "navbar"
  })
  .catch((error) => console.error("Error loading navbar:", error)); // Logs an error if the fetch request fails

// References to DOM elements
document.addEventListener("DOMContentLoaded", () => { // Ensures the DOM is fully loaded before executing the code
  const form = document.getElementById("locationForm"); // Reference to the form with id "locationForm"
  const queryInput = document.getElementById("query"); // Reference to the input element with id "query"
  const resultsContainer = document.getElementById("results"); // Reference to the results container with id "results"

  // Handle form submission
  form.addEventListener("submit", async (e) => { // Adds a submit event listener to the form
    e.preventDefault(); // Prevents the default form submission behavior (page reload)

    const query = queryInput.value.trim(); // Retrieves and trims the user input
    if (!query) { // Checks if the query is empty
      alert("Please enter a location!"); // Alerts the user if no input is provided
      return; // Stops further execution
    }

    // Clear previous results
    resultsContainer.innerHTML = "<p>Loading...</p>"; // Displays a loading message while fetching data

    try {
      // Fetch data from Photon API
      const response = await fetch( // Sends a request to the Photon API with the user query
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}` // Encodes the query into a URL-safe format
      );
      if (!response.ok) { // Checks if the response status is not OK
        throw new Error(`Error: ${response.status}`); // Throws an error with the response status
      }

      const data = await response.json(); // Parses the response as JSON

      // Handle the results
      displayResults(data.features); // Calls a function to display the search results
    } catch (error) {
      console.error("Error fetching data:", error); // Logs an error if the fetch request fails
      resultsContainer.innerHTML =
        "<p>Failed to fetch location data. Please try again later.</p>"; // Displays an error message to the user
    }
  });

  // Function to display results
  function displayResults(features) { // Accepts an array of features as a parameter
    resultsContainer.innerHTML = ""; // Clears the loading message

    if (features.length === 0) { // Checks if no results were found
      resultsContainer.innerHTML = "<p>No results found.</p>"; // Displays a "no results" message
      return; // Stops further execution
    }

    features.forEach((feature) => { // Iterates over each feature in the results
      const { name, country, state } = feature.properties; // Destructures the relevant properties from the feature

      const item = document.createElement("div"); // Creates a new div element
      item.className = "result-item"; // Adds a class to the div element
      item.innerHTML = `
          <p><strong>Name:</strong> ${name || "N/A"}</p> 
          <p><strong>Country:</strong> ${country || "N/A"}</p>
          <p><strong>State:</strong> ${state || "N/A"}</p>
        `; // Populates the div with the result details

      resultsContainer.appendChild(item); // Appends the item to the results container

      // Handle click event to navigate
      item.addEventListener("click", () => { // Adds a click event listener to the item
        navigateToExplorer(name || "Unknown", country || "Unknown"); // Calls a navigation function with the name and country
      });

      // Navigation function
      function navigateToExplorer(name, country) { // Accepts the city name and country as parameters
        const url = `Explorer.html?city=${encodeURIComponent(
          name
        )}&country=${encodeURIComponent(country)}`; // Constructs a URL with the encoded parameters
        console.log(`Navigating to: ${url}`); // Logs the URL for debugging purposes
        window.location.href = url; // Redirects the user to the constructed URL
      }
    });
  }
});
