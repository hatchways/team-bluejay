import React from "react";
import { Map, GoogleApiWrapper, Circle } from "google-maps-react";

const MapContainer = ({ google, coords }) => {
  const outerCircle = { radius: 140, fillOpacity: 0.4 };
  const innerCircle = { radius: 12, fillOpacity: 1 };

  if (!coords) {
    return <Map google={google} zoom={15} />;
  }
  return (
    <Map google={google} zoom={15} initialCenter={coords} center={coords}>
      {[outerCircle, innerCircle].map(({ radius, fillOpacity }, i) => (
        <Circle
          radius={radius}
          center={coords}
          strokeColor="transparent"
          strokeOpacity={0}
          strokeWeight={5}
          fillColor="#ff743d"
          fillOpacity={fillOpacity}
          key={i}
        />
      ))}
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(MapContainer);
