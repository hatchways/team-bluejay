const GOOGLE_API_KEY = "AIzaSyDhNEP92qeLiIJJSqKgFBs5NQffc8YVnlQ";
const addressToCoords = (address) => {
  // to do later
  // dummy coordinates
  // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDhNEP92qeLiIJJSqKgFBs5NQffc8YVnlQ
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      let retData;
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
      return data.results[0].formatted_address;
    });
};

export { addressToCoords, coordsToAddress };
