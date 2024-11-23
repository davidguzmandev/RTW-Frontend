import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../partials/Navbar";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
};
const RecordDetail = () => {
  const { id } = useParams(); // Obtiene el ID desde la URL
  const [record, setRecord] = useState(null);
  const API_URL = import.meta.env.VITE_BACK_API_URL;
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    // Solicitar la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.error('Error al obtener la ubicación: ', err);
          // Puedes establecer una ubicación predeterminada aquí si lo deseas
          setPosition({ latitude: -34.397, longitude: 150.644 });
        }
      );
    } else {
      console.error('La geolocalización no es soportada por este navegador.');
      // Establecer una ubicación predeterminada
      setPosition({ latitude: -34.397, longitude: 150.644 });
    }
  }, []);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`${API_URL}/record/${id}`);
        const data = await response.json();
        setRecord(data);
      } catch (error) {
        console.error("Error al cargar el registro:", error);
      }
    };
    fetchRecord();
  }, [id]);

  if (!record) {
    return <div>Loading Map...</div>;
  }

  return (
    <div className="p-5">
      <Navbar />
      <h1 className="text-xl font-bold">{record.client}</h1>
      <p><strong>Work:</strong> {Object.keys(record.work).join(", ")}</p>
      <p><strong>KM:</strong> {record.km || "0"}</p>
      <p><strong>Date:</strong> {record.date}</p>
      <p><strong>Hour:</strong> {record.hourOpen}</p>
      <p><strong>Comments:</strong> {record.comments || "No comments"}</p>

      <div className="relative">
      {position ? (
        <MapContainer
          center={[position.latitude, position.longitude]}
          zoom={15}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-[300px] z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[position.latitude, position.longitude]}>
            <Popup>
              You are here: {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}
            </Popup>
          </Marker>
          <RecenterMap lat={position.latitude} lng={position.longitude} />
        </MapContainer>
      ) : (
        <div>Loading...</div>
      )}
    </div>
    </div>
  );
};

export default RecordDetail;
