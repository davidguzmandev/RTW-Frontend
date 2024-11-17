import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../partials/Navbar'
import Footer from '../partials/Footer'
import { UserContext } from '../utils/UserContext';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone'; // Time extension

const Dashboard = () => {
  const navigate = useNavigate();
  const [matchingRecords, setMatchingRecords] = useState([]); // Registros con email coincidente
  const [location, setLocation] = useState({latitude:null, longitude:null});

  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_BACK_API_URL;

  const handlePunchOut = async (recordId) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Fecha actual en la zona horaria local
    const currentDateLocal = moment().tz('America/New_York').format('YYYY-MM-DD');
    const punchOutData = {
        id: recordId, // Incluye el ID del registro
        punchOutTime: time,
        punchOutLocation: location,
        punchOutDate: currentDateLocal,
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
      <div className='bg-white min-h-screen flex flex-col'>
        <Navbar />
        <div className='flex-grow mx-auto max-w-screen-xl px-6 py-3'>
        <div className="rounded-lg">
            {user ? (
                <div className='px-8 py-4'>
                    <h2 className='font-semibold text-xl'>Welcome, {user.name}</h2>
                    <p className='text-sm mb-4'>{user.email}</p>
                    {/* {user?.role === 'admin' && 
                      <div className='bg-gray-100 p-4 rounded-xl mb-6'>
                        <p>Contenido para admin.</p>
                      </div>
                    } */}
                    {matchingRecords.length > 0 ? (
                        <div className='bg-gray-100 p-4 rounded-xl'>
                          <p className='text-lg font-normal p-4 text-gray-600'>
                            <span className='inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10'>{matchingRecords.length}</span>
                            &nbsp;Work in progress</p>
                          <ul className='flex-wrap flex place-items-end'>
                            {matchingRecords.map((record) => (
                              <li
                                key={record.id}
                                className='max-w-sm border border-gray-200 rounded-lg shadow bg-white dark:border-gray-200 m-2 w-[275px] h-[270px] flex flex-col'
                              >
                                <div className="px-5 pt-5 text-gray-700 flex-grow">
                                  <h5 className="mb-2 font-bold tracking-tight text-base">{record.client}</h5>
                                  <p className='text-sm'>Work: {Object.keys(record.work).join(', ')}</p>
                                  <p className='text-sm'>KM: {record.km || "0"}</p>
                                  <p className='text-sm'>Location:&nbsp;
                                    <a
                                      href={`https://www.google.com/maps?q=${record.location.latitude},${record.location.longitude}`}
                                      target='_blank'
                                      rel="noopener noreferrer"
                                      className='rounded-full hover:bg-gray-300 text-gray-600 hover:text-blue-500 transition-colors px-2 py-1 text-sm font-semibold'
                                    >
                                      Ver Mapa
                                    </a>
                                  </p>
                                  <p className='text-sm'>Date: {record.date}</p>
                                  <p className='text-sm'>Hour: {record.hourOpen}</p>
                                  <p className='text-sm'>Comments: {record.comments || "No"}</p>
                                </div>
                                <div className="flex justify-end m-2">
                                <button
                                  onClick={(e) => {
                                    // Evitar que se ejecute la acción inmediatamente
                                    e.preventDefault();

                                    // Muestra la ventana de confirmación
                                    const confirmed = window.confirm("Are you sure you want to Punch-out?");

                                    // Si el usuario confirma, ejecuta la función handlePunchOut
                                    if (confirmed) {
                                      handlePunchOut(record.id);
                                    }
                                  }}
                                  type="button"
                                  className="bg-indigo-700 text-white p-2 rounded-full hover:bg-indigo-500 text-sm"
                                >
                                  Punch-out
                                </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                    ) : (
                      <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                          <p>You don't have any open work.</p>
                          <br />
                          <div>
                              <Link 
                              to="/time" 
                              className="bg-indigo-700 text-white p-2 rounded-full hover:bg-indigo-600">
                                 New Punch-In
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
          </div>
          <Footer />
        </div>
      </>
  );
};

export default Dashboard;
