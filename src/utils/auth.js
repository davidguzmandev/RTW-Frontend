import { useNavigate } from 'react-router-dom';

export const useHandleLogout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); 
        navigate('/');
    };

    return handleLogout;
};