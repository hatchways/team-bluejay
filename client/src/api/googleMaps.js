const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const addressToCoords = (address) => {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      let retData;
      console.log(data);
      try {
        retData = {
          address: data.results[0].formatted_address,
          coordinates: {
            latitude: data.results[0].geometry.location.lat,
            longitude: data.results[0].geometry.location.lng,
          },
        };
        return retData;
      } catch {
        return {
          address: null,
          coordinates: null,
        };
      }
    });
};

const coordsToAddress = (latitude, longitude) => {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},%20${longitude}&key=${GOOGLE_API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      let addressComponents = [];
      data.results[0].address_components.forEach((comp) => {
        if (
          comp.types.includes("route") ||
          comp.types.includes("political") ||
          comp.types.includes("postal_code")
        ) {
          addressComponents.push(comp.short_name);
        }
      });
      return addressComponents.join(", ");
    });
};

export { addressToCoords, coordsToAddress };
