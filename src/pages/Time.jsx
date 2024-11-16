import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../partials/Navbar'
import ClockIn from '../components/ClockIn';
import Footer from '../partials/Footer';

const Time = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirige a SignIn si no hay token
        }
    }, [navigate]);

    return (
        <>
            <div className='bg-white h-screen flex flex-col'>
                <div className='flex-grow flex flex-col'>
                    <Navbar />
                    <ClockIn />
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Time;