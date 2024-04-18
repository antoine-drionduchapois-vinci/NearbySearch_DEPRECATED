export async function geocodeAddress(address) {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            const location = results[0].geometry.location;
            resolve({ latitude: location.lat(), longitude: location.lng() });
          } else {
            reject(new Error("No results found for this address"));
          }
        } else {
          reject(new Error("Geocoder failed due to: " + status));
        }
      });
    });
  }
  