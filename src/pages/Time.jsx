import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../partials/Navbar'
import ClockIn from '../components/ClockIn';

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
            <div className='bg-slate-200'>
                <Navbar />
                <ClockIn />
            </div>
        </>
    );
};

export default Time;