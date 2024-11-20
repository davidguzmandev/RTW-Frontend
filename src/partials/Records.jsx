import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/UserContext";
import moment from "moment-timezone"; // Time extension
import { Link } from "react-router-dom";
import { CardPC } from "../components/CardPC";

export const Records = () => {
  const navigate = useNavigate();
  const [matchingRecords, setMatchingRecords] = useState([]); // Registros con email coincidente
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_BACK_API_URL;

  const handlePunchOut = async (recordId) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    // Fecha actual en la zona horaria local
    const currentDateLocal = moment()
      .tz("America/New_York")
      .format("YYYY-MM-DD");
    const punchOutData = {
      id: recordId, // Incluye el ID del registro
      punchOutTime: time,
      punchOutLocation: location,
      punchOutDate: currentDateLocal,
      open: false,
    };

    try {
      await fetch(`${API_URL}/timePunchOut`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(punchOutData),
      });

      // Actualizar el estado del componente para eliminar el registro del DOM
      setMatchingRecords(
        matchingRecords.filter((record) => record.id !== recordId)
      );
    } catch (error) {
      console.error("Error al registrar el punch-out:", error);
    }
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error al obtener la ubicación: ", error);
        }
      );
    } else {
      console.error("La geolocalización no es soportada en este navegador.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige a SignIn si no hay token
      return;
    }

    // Cargar registros desde el archivo JSON y encontrar coincidencias de email
    const fetchTimeRecording = async () => {
      try {
        const response = await fetch(`${API_URL}/time`);
        const data = await response.json();

        // Filtrar los registros que coinciden con el email del usuario logueado
        const recordsWithSameEmail = data.filter(
          (record) => record.email === user.email && record.open == true
        );
        setMatchingRecords(recordsWithSameEmail);
      } catch (error) {
        console.error("Error al cargar los registros:", error);
      }
    };

    fetchTimeRecording();
    fetchLocation();
  }, [navigate, user, API_URL]);
  return (
    <div className="rounded-lg">
      {user ? (
        <div className="px-8 py-4">
          <h2 className="rounded bg-white bg-transparent font-semibold text-xl text-center">
            Hi, {user.name}
          </h2>
          {/* {user?.role === 'admin' && 
                      <div className='bg-gray-100 p-4 rounded-xl mb-6'>
                        <p>Contenido para admin.</p>
                      </div>
                    } */}
          {matchingRecords.length > 0 ? (
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-lg font-normal p-4 text-gray-600">
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                  {matchingRecords.length}
                </span>
                &nbsp;Work in progress
              </p>
              <CardPC />
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p>You don't have any open work.</p>
                <br />
                <div>
                  <Link
                    to="/time"
                    className="bg-indigo-700 text-white p-2 rounded-full hover:bg-indigo-600 w-full">
                    Start Shift
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
    </div>
  );
};
