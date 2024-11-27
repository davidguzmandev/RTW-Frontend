import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/UserContext";
import { Link } from "react-router-dom";
import { fetchLocation } from "../utils/fetchLocation";
import { calculateElapsedTime } from "../utils/elapsedTime";
import { handlePunchOut } from "../utils/handlePunchOut";

export const CardMobile = () => {
  const navigate = useNavigate();
  const [matchingRecords, setMatchingRecords] = useState([]); // Registros con email coincidente
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [elapsedTime, setElapsedTime] = useState({}); // Almacena los tiempos transcurridos para cada record

  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_BACK_API_URL;

  /* const handlePunchOut = async (recordId) => {
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
  }; */

  const onPunchOut = async (recordId) => {
    const confirmed = window.confirm("Are you sure you want to Punch-out?");
    if (!confirmed) return;

    try {
      await handlePunchOut(recordId, location, API_URL, setMatchingRecords, matchingRecords);
    } catch (error) {
      console.error("Error during punch-out:", error);
    }
  };

/*   const fetchLocation = () => {
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
  }; */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige a SignIn si no hay token
      return;
    }

    fetchLocation()
    .then((locationData) => setLocation(locationData))
    .catch((err) => console.log(err));

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
        // Calcular tiempos transcurridos iniciales
        const initialElapsedTimes = {};
        recordsWithSameEmail.forEach((record) => {
          initialElapsedTimes[record.id] = calculateElapsedTime(record.hourOpen);
        });
        setElapsedTime(initialElapsedTimes);
      } catch (error) {
        console.error("Error al cargar los registros:", error);
      }
    };

    fetchTimeRecording();
  }, [navigate, user.email, API_URL]);

  useEffect(() => {
    // Intervalo para actualizar los tiempos dinámicamente
    const interval = setInterval(() => {
      setElapsedTime((prevTimes) => {
        const updatedTimes = { ...prevTimes };
        matchingRecords.forEach((record) => {
          updatedTimes[record.id] = calculateElapsedTime(record.hourOpen);
        });
        return updatedTimes;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [matchingRecords]);

  return (
    <>
      {matchingRecords.length > 0 ? (
        <div className="bg-gray-100 w-svw">
          <p className="font-normal text-gray-600 text-sm text-center p-2">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-1 font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              {matchingRecords.length}
            </span>
            &nbsp;Work in progress
          </p>
          {/* Clase para resoluciones mayores de mobile */}
          <ul className="flex-wrap flex place-items-end">
            {matchingRecords.map((record) => (
              <li
                key={record.id}
                className="border border-gray-200 bg-white dark:border-gray-200 w-screen flex">
              <Link to={`/record/${record.id}`} className="flex-grow">
                <div className="px-5 pt-1 text-gray-700 flex-grow flex flex-col w-3/4">
                  <h5 className="font-bold tracking-tight text-base">
                    {record.client}
                  </h5>

                  <p className="text-sm">Date: {record.date} Hour: {record.hourOpen}</p>
                  <p className="text-sm">Elapsed Time: {elapsedTime[record.id] || "Calculating..."}</p>
                </div>
                </Link>
                <div className="flex items-stretch">
                  <button
                    onClick={(e) => {
                      // Evitar que se ejecute la acción inmediatamente
                      e.preventDefault();
                      onPunchOut(record.id)
                    }}
                    type="button"
                    className="bg-indigo-700 text-white p-2 hover:bg-indigo-500 text-sm h-full">
                    End Shift
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-10">
          <div className="text-center">
            <p>You don't have any open work.</p>
          </div>
        </div>
      )}
    </>
  );
};
