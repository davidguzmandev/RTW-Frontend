import { useEffect } from 'react';
import { SignIn } from '../components/SignIn';
import Footer from '../partials/Footer';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
      // Verifica si el usuario tiene un token en localStorage
      const token = localStorage.getItem('token');
      if (token) {
        // Si el token existe, redirige al dashboard
        navigate('/dashboard');
      }
    }, [navigate])

    return (
        <>
            <div className="min-w-screen min-h-screen bg-gray-900 flex flex-col justify-between">
                <div className="flex-grow flex items-center justify-center px-5 py-5">
                    <div className="bg-gray-200 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden max-w-[1000px]">
                        <div className="md:flex w-full">
                        <div className="hidden md:flex md:flex-wrap w-1/2 bg-indigo-500 py-10 px-10 justify-center content-center">
                            <img src="/images/logo.png" alt="Ready to Work" className='max-w-md h-min max-lg:w-80'/>
                        </div>
                        <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
                            <div className="text-center mb-10">
                                <h1 className="font-bold text-3xl text-gray-900">Sign In</h1>
                                <p>Enter your information to Sign In</p><br />
                                <p>-- Dear guest, login with: --</p>
                                <p><strong>Email:</strong> admin@gmail.com</p>
                                <p><strong>Password:</strong> 123</p>
                                <p>and wait 20 second</p>
                            </div>
                                <SignIn/>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Home;