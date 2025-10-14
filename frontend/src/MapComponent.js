
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import { useState } from 'react';

export default function MapComponent({ addPropertyCoords }) {
  const [coords, setCoords] = useState([]);

  function LocationSelector() {
    useMapEvents({
      click(e) {
        setCoords([...coords, [e.latlng.lat, e.latlng.lng]]);
      }
    });
    return null;
  }

  const submitCoordinates = () => {
    addPropertyCoords(coords);
    setCoords([]);
  };

  return (
    <div>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '500px' }}>
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <LocationSelector />
        {coords.length > 0 && <Polygon positions={coords} color='blue' />}
      </MapContainer>
      <button onClick={submitCoordinates}>Submit Coordinates</button>
    </div>
  );
}
