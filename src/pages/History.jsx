import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconChevronLeft } from "@tabler/icons-react";
import Navbar from "../partials/Navbar";
import { UserContext } from "../utils/UserContext";
import { fetchLocation } from "../utils/fetchLocation";

export const History = () => {
  const navigate = useNavigate();
  const [matchingRecords, setMatchingRecords] = useState([]); // Registros con email coincidente
  const [location, setLocation] = useState({ lat: -34.397, lng: 150.644 });
  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_BACK_API_URL;

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
            (record) => record.email === user.email
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

  return (
    <>
      <div className="py-5 flex justify-between bg-gray-100 sm:hidden">
        <div className="pl-5">
          <Link to="/dashboard">
            <IconChevronLeft stroke={2} />
          </Link>
        </div>
        <div className="text-center m-auto">History</div>
      </div>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
      </div>

      {matchingRecords.length > 0 ? (
        <div className="bg-gray-100 w-svw">
          <p className="font-normal text-gray-600 text-sm text-center p-2">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-1 font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              {matchingRecords.length}
            </span>
            &nbsp;Work in progress
          </p>

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
                    <p className="text-sm">
                      Date: {record.date} Hour: {record.hourOpen}
                    </p>
                  </div>
                </Link>
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
