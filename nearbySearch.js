export async function nearbySearch(location, radius, type) {
  const service = new google.maps.places.PlacesService(new google.maps.Map(document.createElement("div"))); // Create a dummy map element

  const request = {
    location: new google.maps.LatLng(location.latitude, location.longitude),
    radius: radius,
    type: type
  };

  try {
    const response = await new Promise((resolve, reject) => {
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
    
    const names = response.map(place => place.name);
    
    return response;
  } catch (error) {
    console.error("Places service failed:", error);
    return []; // Or handle the error differently (e.g., throw the error)
  }
}
