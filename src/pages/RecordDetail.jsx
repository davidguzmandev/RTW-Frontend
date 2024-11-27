import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Navbar from "../partials/Navbar";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { handlePunchOut } from "../utils/handlePunchOut";
import { IconChevronLeft } from "@tabler/icons-react";
import { calculateElapsedTime } from "../utils/elapsedTime";
import { UserContext } from "../utils/UserContext";
import PopupModal from "../utils/EndShift";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { id } = useParams(); // Obtiene el ID desde la URL
  const [matchingRecords, setMatchingRecords] = useState([]);
  const API_URL = import.meta.env.VITE_BACK_API_URL;
  const [position, setPosition] = useState({ lat: -34.397, lng: 150.644 });
  const [elapsedTime, setElapsedTime] = useState(""); // Almacena los tiempos transcurridos para cada record
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEndShiftClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onPunchOut = async (recordId, comment2) => {
    setIsModalOpen(false);

    try {
      await handlePunchOut(
        recordId,
        position,
        API_URL,
        setMatchingRecords,
        matchingRecords,
        comment2
      );
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to punch out. Please try again.");
      console.error("Error during punch-out:", error);
    }
  };

  useEffect(() => {
    // Solicitar la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Error al obtener la ubicación: ", err);
          // Puedes establecer una ubicación predeterminada aquí si lo deseas
          setPosition({ lat: -34.397, lng: 150.644 });
        }
      );
    } else {
      console.error("La geolocalización no es soportada por este navegador.");
      // Establecer una ubicación predeterminada
      setPosition({ lat: -34.397, lng: 150.644 });
    }
  }, []);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`${API_URL}/record/${id}`);
        const data = await response.json();
        setMatchingRecords(data);

        // Calcular tiempos transcurridos iniciales
        if (data?.hourOpen) {
          setElapsedTime(calculateElapsedTime(data.hourOpen));
        }
      } catch (error) {
        console.error("Error al cargar el registro:", error);
      }
    };

    fetchRecord();
  }, [id]);

  useEffect(() => {
    if (!matchingRecords || !matchingRecords.hourOpen) return;

    const interval = setInterval(() => {
      setElapsedTime(calculateElapsedTime(matchingRecords.hourOpen));
    }, 60000);

    return () => clearInterval(interval);
  }, [matchingRecords]);

  return (
    <>
      <div className="py-5 flex justify-between bg-gray-100">
        <div className="pl-5">
          <Link to="/dashboard">
            <IconChevronLeft stroke={2} />
          </Link>
        </div>
        <div className="text-center m-auto">Work in Progress</div>
      </div>
      <div className="px-5 py-2">
        <Navbar />
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm bg-indigo-800 border rounded-lg shadow border-indigo-300">
            <div className="relative">
              {position ? (
                <MapContainer
                  center={[position.lat, position.lng]}
                  zoom={15}
                  scrollWheelZoom={true}
                  zoomControl={false}
                  className="w-full h-[300px] rounded-t-lg">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[position.lat, position.lng]}>
                    <Popup>
                      You are here: {position.lat.toFixed(4)},{" "}
                      {position.lng.toFixed(4)}
                    </Popup>
                  </Marker>
                  <RecenterMap lat={position.lat} lng={position.lng} />
                </MapContainer>
              ) : (
                <div className="m-4">Loading Map...</div>
              )}
            </div>
            <div className="m-4 text-white">
              <h1 className="text-xl font-bold">{matchingRecords.client}</h1>
              <p>
                <strong>Work:</strong>{" "}
                {matchingRecords.work
                  ? Object.keys(matchingRecords.work).join(", ")
                  : "No work data"}
              </p>
              <p>
                <strong>KM:</strong> {matchingRecords.km || "0"}
              </p>
              <p>
                <strong>Date:</strong> {matchingRecords.date}
              </p>
              <p>
                <strong>Hour:</strong> {matchingRecords.hourOpen}
              </p>
              <p>
                <strong>Comments:</strong>{" "}
                {matchingRecords.comments || "No comments"}
              </p>
              <p className="text-center mt-6 text-sm">
                Elapsed Time <br />
                <span className="font-bold text-2xl">
                  {elapsedTime || "Calculating..."}
                </span>
              </p>
              <div className="flex items-stretch justify-center mt-4 mb-10">
                <button
                  onClick={
                    handleEndShiftClick
                    /* onPunchOut(matchingRecords.id); */
                  }
                  type="button"
                  className="bg-indigo-950 text-white p-4 hover:bg-indigo-500 text-base h-full w-full rounded-md">
                  End Shift
                </button>
                <PopupModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  elapsedTime={elapsedTime}
                  onSubmit={(comment2) =>
                    onPunchOut(matchingRecords.id, comment2)
                  } // Pasa el comentario recibido
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordDetail;
