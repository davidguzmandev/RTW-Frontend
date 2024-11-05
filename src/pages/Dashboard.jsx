import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../partials/Navbar'
import { UserContext } from '../utils/UserContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [matchingRecords, setMatchingRecords] = useState([]); // Registros con email coincidente
  const [location, setLocation] = useState({latitude:null, longitude:null});

  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_BACK_API_URL;

  const handlePunchOut = async (recordId) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const punchOutData = {
        id: recordId, // Incluye el ID del registro
        punchOutTime: time,
        punchOutLocation: location,
        open: false
    };

    try {
        await fetch(`${API_URL}/timePunchOut`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(punchOutData),
        });

        // Actualizar el estado del componente para eliminar el registro del DOM
        setMatchingRecords(matchingRecords.filter((record) => record.id !== recordId));
    } catch (error) {
        console.error('Error al registrar el punch-out:', error);
    }
  };

  const fetchLocation = () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                console.error('Error al obtener la ubicación: ',error);
            }
        );
    } else {
        console.error('La geolocalización no es soportada en este navegador.')
    }
};

  useEffect(() => {

    if(!user) return; // Espera a que user este definido
      const token = localStorage.getItem('token');
      if (!token) {
          navigate('/'); // Redirige a SignIn si no hay token
          return;
      }

      // Cargar registros desde el archivo JSON y encontrar coincidencias de email
    const fetchTimeRecording = async () => {
        try {
          const response = await fetch(`${API_URL}/time`);
          const data = await response.json();

          // Filtrar los registros que coinciden con el email del usuario logueado
          const recordsWithSameEmail = data.filter((record) => record.email === user.email && record.open == true);
          setMatchingRecords(recordsWithSameEmail);
        } catch (error) {
          console.error('Error al cargar los registros:', error);
        }
      };

    fetchTimeRecording();
    fetchLocation();
  }, [navigate, user, API_URL]);

  return (
      <>
        <Navbar />
        <div className="mx-auto max-w-screen-xl px-6 py-3">
            {user ? (
                <div>
                    <h2 className='font-semibold text-xl'>Welcome, {user.name}</h2>
                    <p className='text-sm mb-4'>{user.email}</p>
                    {matchingRecords.length > 0 ? (
                        <div>
                          <ul className='flex-wrap flex'>
                              {matchingRecords.map((record) => (
                                  <li
                                  key={record.id}
                                  className='max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2'
                                  >
                                      <div className="p-5">
                                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{record.client}</h5>
                                          <p className='font-normal text-gray-700 dark:text-gray-400'>Work: {Object.keys(record.work).join(', ')}</p>
                                          <p className='font-normal text-gray-700 dark:text-gray-400'>KM: {record.km}</p>
                                          <p className='font-normal text-gray-700 dark:text-gray-400'>Comments: {record.comments}</p>
                                          <p className='font-normal text-gray-700 dark:text-gray-400'>Location: {record.location.latitude}, {record.location.longitude}</p>
                                          <p className='font-normal text-gray-700 dark:text-gray-400'>Date: {record.date}</p>
                                          <p className='font-normal text-gray-700 dark:text-gray-400'>Hour: {record.hourOpen}</p>
                                      </div>
                                      <div className="flex justify-end">
                                        <button
                                          onClick={() => handlePunchOut(record.id)}
                                          type="button"
                                          className=" bg-red-800 text-white p-2 rounded-md hover:bg-red-600"
                                        >
                                          Punch-out
                                        </button>
                                      </div>
                                  </li>
                              ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No tienes ningún trabajo abierto.</p>
                    )}
                </div>
            ) : (
                <p>Cargando datos del usuario...</p>
            )}
        </div>
      </>
  );
};

export default Dashboard;