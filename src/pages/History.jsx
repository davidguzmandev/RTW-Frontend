import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconChevronLeft } from "@tabler/icons-react";
import Navbar from "../partials/Navbar";
import { UserContext } from "../utils/UserContext";
import { fetchLocation } from "../utils/fetchLocation";

export const History = () => {
  const navigate = useNavigate();
  const [matchingRecords, setMatchingRecords] = useState([]); // Registros con email coincidente
  const [location, setLocation] = useState({ latitude: -34.397, longitude: 150.644 });
  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_BACK_API_URL;

  function getCurrentWeekRange() {
    const currentDate = new Date();

    // Obtener el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
    const currentDay = currentDate.getDay();

    // Ajustar el día para que el lunes sea el primer día de la semana
    const dayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    // Calcular el lunes actual
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + dayOffset);

    // Calcular el domingo actual
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Función para convertir a formato "yyyy-mm-dd"
    function convertToISOFormat(date) {
      const day = String(date.getDate()).padStart(2, "0"); // Agrega cero si el día es menor a 10
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Agrega cero si el mes es menor a 10
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }

    // Convertir las fechas a formato "yyyy-mm-dd"
    const mondayFormatted = convertToISOFormat(monday); // "2024-11-25"
    const sundayFormatted = convertToISOFormat(sunday); // "2024-12-01"

    return `${mondayFormatted} to ${sundayFormatted}`;
  }

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
        if (user && user.email) {
          // Verifica que user y user.email estén definidos
          const recordsWithSameEmail = data.filter(
            (record) => record.email === user.email && record.open == false
          );
          setMatchingRecords(recordsWithSameEmail);
        } else {
          console.warn("User is not defined yet.");
        }
      } catch (error) {
        console.error("Error al cargar los registros:", error);
      }
    };
    fetchTimeRecording();
  }, [navigate, user, API_URL]);

  // Función para calcular horas totales y minutos
  const calculateTotalTime = (records) => {
    let totalMinutes = 0;

    records.forEach((record) => {
      const match = record.duration.match(/(\d+)h\s*(\d+)m/); // Extraer horas y minutos
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        totalMinutes += hours * 60 + minutes; // Convertir horas a minutos y sumar
      }
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${totalHours}h ${remainingMinutes}m`;
  };

  const totalHoursFormatted = calculateTotalTime(matchingRecords);

  return (
    <>
      <div className="bg-white flex flex-col">
        <Navbar />
      </div>
      <div className="py-5 flex justify-center items-center bg-gray-100 sm:hidden relative">
        <div className="absolute left-5">
          <Link to="/dashboard">
            <IconChevronLeft stroke={2} />
          </Link>
        </div>
        <div className="text-center">Work History</div>
      </div>

      {matchingRecords.length > 0 ? (
        <div className="max-sm:w-svw w-[520px] mx-auto max-w-screen-xl">
          <p className="text-sm text-center">{getCurrentWeekRange()}</p>
          <div className="text-center p-2 bg-gray-100 rounded-t-lg">
            <p>Total Hours:</p>
            <p className="font-bold text-lg">{totalHoursFormatted}</p>
          </div>
          <ul className="flex-wrap flex place-items-end">
            {matchingRecords.map((record) => (
              <li
                key={record.id}
                className="bg-white w-screen flex border-b-indigo-500 border">
                <div className="px-5 pt-1 text-gray-700 flex-grow flex flex-col w-3/4">
                  <p className="text-xs">{record.date}</p>
                  <h5 className="font-bold tracking-tight text-base">
                    {record.client}
                  </h5>
                  <p className="text-sm">
                    Hour: {record.hourOpen}
                  </p>
                  <p className="text-sm">Hours worked: {record.duration}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-10">
          <div className="text-center">
            <p>You have not recorded time yet</p>
          </div>
        </div>
      )}
    </>
  );
};
