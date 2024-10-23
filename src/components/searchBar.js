import React, { useState, useEffect } from "react";
import "./searchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch data from API on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("https://countriesnow.space/api/v0.1/countries/population/cities", {
      headers: {
        "X-CSCAPI-KEY": ""  //  API key here
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("API response:", json);  // Debug the API response

        // Check if the API response contains data
        if (json.data) {
          setApiData(json.data);  // Store the fetched data
          setFilteredData(json.data);  // Initialize with the full list of data
        } else {
          console.error("No data found in the API response");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Handle input changes and filter data
  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    // Filter the fetched data based on the input
    const filtered = apiData.filter((item) =>
      item.city.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="input-wrapper">
      <i id="search-icon" className="fas fa-search" />
      <input
        type="text"
        placeholder="Search for cities..."
        value={query}
        onChange={handleChange}
      />
      <ul>
        {/* Display filtered API data only when there is a query */}
        {query && filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <li key={index}>
              <strong>City:</strong> {item.city}, <strong>Country:</strong> {item.country}
            </li>
          ))
        ) : query ? (
          <li>No results found</li>
        ) : null}
      </ul>
    </div>
  );
};

export default SearchBar;
