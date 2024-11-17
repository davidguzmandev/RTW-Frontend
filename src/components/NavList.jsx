import { useContext, useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importa iconos para abrir y cerrar el menú
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../utils/UserContext';
import { IconUserCircle } from '@tabler/icons-react';

export function NavList() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirige a SignIn si no hay token
            return;
        }
      }, [navigate, user]);

    return (
        <nav className='relative'>
        {/* Icono del burger menu */}
            <button
                onClick={toggleMenu}
                className='text-black xl:hidden focus:outline-none'
            >
                {isOpen ? <FaTimes size={24}/> : <FaBars size={24} />}
            </button>
        {/* Menu items */}
        <ul
        className={`${ isOpen ? 'block rounded-md max-lg:border bg-white border-slate-100 max-lg:shadow-md w-48 text-left p-2' : 'hidden'}
        absolute top-full right-0 xl:flex lg:static lg:w-auto lg:bg-transparent lg:flex-row lg:items-center lg:gap-2 lg:my-0 w-24`}
        >
            <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors px-6 py-2 text-sm font-semibold">
                <Link to="/" className='text-right ' onClick={toggleMenu}>Home</Link>
            </li>
            <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors px-6 py-2 text-sm font-semibold">
                <Link to="/time" onClick={toggleMenu}>Time Record</Link>
            </li>
            {/* Contenido para Admin y editores */}
            {(user?.role === 'admin' || user?.role === 'editor') &&
                <>
                    <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors px-6 py-2 text-sm font-semibold">
                    <Link to="https://rtw-backend.onrender.com/api/exportExcel" onClick={toggleMenu}>
                        Export Data
                    </Link>
                    </li>
                    <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors px-6 py-2 text-sm font-semibold">
                        <Link to="/" onClick={toggleMenu}>Edit Users</Link>
                    </li>
                </>
            }
            <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors px-6 py-2 text-sm font-semibold">
                <a href="/account" onClick={toggleMenu}>
                    <IconUserCircle stroke={1.25} />
                </a>
            </li>
        </ul>
        </nav>
    );
}

