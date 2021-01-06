import React from 'react';
import './Map.css';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { showDataOnMap } from './util';

function Map({ countries, center, zoom, casesType }) {
  return (
    <div className="map">
      <MapContainer center={center} zoom={zoom} zoomControl={false}>
        <TileLayer
          className
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        />
        <ZoomControl position="bottomright" />
        {showDataOnMap(countries, casesType)}
      </MapContainer>
    </div>
  );
}

export default Map;
