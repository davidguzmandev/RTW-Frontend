import { useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../partials/Navbar'
import Footer from '../partials/Footer'
import { UserContext } from '../utils/UserContext';
import { useHandleLogout } from '../utils/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = useHandleLogout();

  const { user } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/'); // Redirige a SignIn si no hay token
        return;
    }
  }, [navigate]);

  return (
      <>
        <div className='bg-white flex h-screen flex-col'>
          <Navbar />
            <div className='flex-grow'>
              <div className='mx-auto max-w-screen-xl px-6 py-3 bg-gray-100 w-96 rounded-xl'>
                <h2 className='font-semibold text-xl text-center'>Account</h2>
                <div className='text-center p-4'>
                  {user ? (
                    <>
                      <p>{user.name}</p>
                      <p>{user.email}</p>
                    </>
                  ) : (
                    <p>Loading user data...</p>
                  )}
                  <div className='mt-4'>
                    <button
                      onClick={handleLogout}
                      className='bg-indigo-700 text-white px-4 py-2 rounded-full hover:bg-indigo-600'>
                        Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          <Footer />
        </div>
      </>
  );
};

export default Dashboard;
