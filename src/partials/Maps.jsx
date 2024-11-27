import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar el icono del marcador por defecto
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para actualizar la vista del mapa
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
};
const Maps = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    let watchId;

    // Solicitar la ubicación del usuario
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error('Error al obtener la ubicación: ', err);
          // Puedes establecer una ubicación predeterminada aquí si lo deseas
          setPosition({ lat: -34.397, lng: 150.644 });
        }
      );
    } else {
      console.error('La geolocalización no es soportada por este navegador.');
      // Establecer una ubicación predeterminada
      setPosition({ lat: -34.397, lng: 150.644 });
    }

    // Limpieza al desmontar el componente
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <div className="relative">
      {position ? (
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={15}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-[500px] z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[position.lat, position.lng]}>
            <Popup>
              You are here: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </Popup>
          </Marker>
          <RecenterMap lat={position.lat} lng={position.lng} />
        </MapContainer>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Maps;
