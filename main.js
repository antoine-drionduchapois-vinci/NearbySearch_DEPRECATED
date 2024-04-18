import { geocodeAddress } from './geocodeAdress';
import { nearbySearch } from './nearbySearch';
import { AdvancedMarkerElement } from '@google/maps';


import './style.css'

// Example usage:
// Replace with your actual location

document.querySelector('#app').innerHTML = `
  <div><h1>Whise Search</h1></div>
  <p>Permets d'indiquer des points d'intérets proche d'une adresse</p>
  <div>
    <label>Adresse</label>
    <input type="text" id="adress" name="adress" value="123 rue de la station"> 
    <label>Ville</label>
    <input type="text" id="city" name="city" value="woluwe">

    <label>Type de lieu</label>
    <select name="type" id="type">
      <option value="school">école</option>
      <option value="gym">salle de sport</option>
      <option value="supermarket">supermarché</option>
      <option value="bus_station">bus</option>
      <option value="bakery">boulanger</option>
      <option value="cafe">café</option>
      <option value="hospital">hopital</option>
      <option value="light_rail_station">tram</option>
    </select>
    <label>Rayon (Km)</label>
    <input type="number" id="radius" placeholder="Radius (Km)" name="radius" min="1" max="10" value="1" required>
    <button id="searchBtn">Chercher</button>
    <div id="results"></div>
    <div id="map" style="width: 100%; height: 400px;"></div>

  </div>
`;

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const resultsContainer = document.getElementById("results");

  searchBtn.addEventListener("click", async () => {
    const placeType = document.getElementById("type").value;
    const radius = parseInt(document.getElementById("radius").value) * 1000; // Convert km to meters
    const adress = document.getElementById("adress").value + " " + document.getElementById("city").value;
    console.log(adress);
    try {
      // Use async/await to wait for geocoding
      const location = await geocodeAddress(adress);
      // Now location contains { latitude: ..., longitude: ... }

      nearbySearch(location, radius, placeType)
        .then(results => {
          var markers = [];

          
        
          // crée list markers
          results.map(e => {
              const myLat = e.geometry.location.lat();
              const myLong = e.geometry.location.lng();
              const title = e.name;
              const myLatLong = {lat: myLat, lng : myLong};
              const markerData = {
                position: { lat: myLat, lng: myLong },
                title: title,
              };
              markers.push(markerData);
            });
         
            // Crée Map
     
            async function initMap(markers) {
              // Init map (assuming you have a div with id="map")
              const mapId = `my-advanced-map-${Math.random().toString(36).substr(2, 9)}`;
              const { Map } = await google.maps.importLibrary("maps");
              const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
              const map = new Map(document.getElementById("map"), {
                center: { lat: location.latitude, lng:  location.longitude},
                zoom: 14,
                mapId: mapId
              });
            
              
              // Place markers on the map
              for (let marker of markers) {
                const infoWindow = new google.maps.InfoWindow({
                  content: `<p style="color: black">${marker.title}</p>`, // Set content to place name
                });

                const newMarker = new AdvancedMarkerElement({
                  position: marker.position,
                  map: map,
                  title: marker.title,
                });
                
                 // Add click event listener to the marker
                  newMarker.addListener('click', () => {
                    infoWindow.open({
                      anchor: newMarker,
                      map: map,
                    });
                  });
            
              }
            }

        
          
    
         
          
  
       
          // Process and display the results here
          resultsContainer.innerHTML = ""; // Clear previous results

          if (results.length > 0) {
            const list = document.createElement('ul');
            for (const place of results) {
              const listItem = document.createElement('li');
              listItem.textContent = `${place.name}`; // Assuming results have a 'name' property
              list.appendChild(listItem);
            }
            resultsContainer.appendChild(list);
          } else {
            resultsContainer.textContent = "No results found.";
          }
          initMap(markers);
        })
        .catch(error => {
          console.error("Nearby search failed:", error);
          resultsContainer.textContent = "Search failed. Please try again.";
        });
    } catch (error) {
      console.error("Geocoding failed:", error);
      resultsContainer.textContent = "Geocoding failed. Please try again.";
    }
  });
});
