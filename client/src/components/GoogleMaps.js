import React from "react";
import { Map, GoogleApiWrapper, Circle } from "google-maps-react";

const MapContainer = ({ google }) => {
  const coords = { lat: 47.444, lng: -122.176 };
  const outerCircle = { radius: 140, fillOpacity: 0.4 };
  const innerCircle = { radius: 12, fillOpacity: 1 };

  return (
    <Map google={google} zoom={15} initialCenter={coords}>
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

const MOSHES_GOOGLE_MAPS_API_KEY = "AIzaSyAN3q6E8D80h38QQsiSWQ5keW6YSRMPqYc";

export default GoogleApiWrapper({
  apiKey: MOSHES_GOOGLE_MAPS_API_KEY,
})(MapContainer);
