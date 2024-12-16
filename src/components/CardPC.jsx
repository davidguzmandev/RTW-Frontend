import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/UserContext";
import { calculateElapsedTime } from "../utils/elapsedTime";
import { handlePunchOut } from "../utils/handlePunchOut";
import { fetchLocation } from "../utils/fetchLocation";
import { IconBoltFilled} from "@tabler/icons-react";
import PopupModal from "../utils/EndShift";

export const CardPC = () => {
  const navigate = useNavigate();
  const [matchingRecords, setMatchingRecords] = useState([]); // Registros con email coincidente
  const [location, setLocation] = useState({
    latitude: -34.397,
    longitude: 150.644,
  });
  const [elapsedTime, setElapsedTime] = useState(""); // Almacena los tiempos transcurridos para cada record
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_BACK_API_URL;

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
        location,
        API_URL,
        setMatchingRecords,
        matchingRecords,
        comment2,
        elapsedTime
      );
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to punch out. Please try again.");
      console.error("Error during punch-out:", error);
    }
  };

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
        const initialElapsedTimes = {};
        recordsWithSameEmail.forEach((record) => {
          initialElapsedTimes[record.id] = calculateElapsedTime(
            record.hourOpen,
            record.date
          );
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
          updatedTimes[record.id] = calculateElapsedTime(
            record.hourOpen,
            record.date
          );
        });
        return updatedTimes;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [matchingRecords]);

  return (
    <>
      {matchingRecords.length > 0 ? (
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-lg font-normal p-4 text-gray-600">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              {matchingRecords.length}
            </span>
            &nbsp;Work in progress
          </p>
          {/* Clase para resoluciones mayores de mobile */}
          <ul className="flex-wrap flex place-items-end">
            {matchingRecords.map((record) => (
              <li
                key={record.id}
                className="max-w-sm border border-gray-200 rounded-lg shadow bg-white dark:border-gray-200 m-2 w-[275px] h-[270px] flex flex-col">
                <div className="px-5 pt-5 text-gray-700 flex-grow">
                  <h5 className="mb-2 font-bold tracking-tight text-base">
                    {record.client}
                  </h5>
                  <p className="text-sm">
                    Work: {Object.keys(record.work).join(", ")}
                  </p>
                  <p className="text-sm">KM: {record.km || "0"}</p>
                  <p className="text-sm">
                    Location:&nbsp;
                    <a
                      href={`https://www.google.com/maps?q=${record.location.latitude},${record.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full hover:bg-gray-300 text-gray-600 hover:text-blue-500 transition-colors px-2 py-1 text-sm font-semibold">
                      Ver Mapa
                    </a>
                  </p>
                  <p className="text-sm">Date: {record.date}</p>
                  <p className="text-sm">Hour: {record.hourOpen}</p>
                  <p className="text-sm">Comments: {record.comments || "No"}</p>
                  <p className="text-sm text-center">Elapsed Time</p>
                  <p className="text-lg text-center">
                    {elapsedTime[record.id] || "Calculating..."}
                  </p>
                </div>
                <div className="flex justify-end m-2">
                  <button
                    onClick={handleEndShiftClick}
                    type="button"
                    className="bg-indigo-700 text-white p-2 rounded-full hover:bg-indigo-500 text-sm w-full">
                    End Shift
                  </button>
                  <PopupModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    elapsedTime={elapsedTime[record.id]}
                    onSubmit={(comment2) => onPunchOut(record.id, comment2)} // Pasa el comentario recibido
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-4">
          <div className="text-center font-medium text-base text-neutral-400">
            <p className="flex">
              <IconBoltFilled stroke={1} />
              Let's get to work!
            </p>
          </div>
        </div>
      )}
    </>
  );
};
