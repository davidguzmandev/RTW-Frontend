import { useState } from 'react';
import { useHandleLogout } from '../utils/auth';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importa iconos para abrir y cerrar el menú
import { Link } from 'react-router-dom';

export function NavList() {
    const handleLogout = useHandleLogout();
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className='relative'>
        {/* Icono del burger menu */}
            <button
                onClick={toggleMenu}
                className='text-black lg:hidden focus:outline-none'
            >
                {isOpen ? <FaTimes size={24}/> : <FaBars size={24} />}
            </button>
        {/* Menu items */}
        <ul
        className={`${ isOpen ? 'block rounded-md max-lg:border bg-white border-slate-100 max-lg:shadow-md' : 'hidden'}
        absolute top-full right-0 lg:flex lg:static lg:w-auto lg:bg-transparent lg:flex-row lg:items-center lg:gap-2 lg:my-0 w-24`}
        >
            <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors justify-end px-6 py-2 text-sm font-semibold">
            <Link to="/" className='text-right ' onClick={toggleMenu}>Home</Link>
            </li>
            <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors justify-end px-6 py-2 text-sm font-semibold">
                <Link to="/time" onClick={toggleMenu}>Time Record</Link>
            </li>
            <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors justify-end px-6 py-2 text-sm font-semibold">
                <button
                    onClick={handleLogout}
                    className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors"
                >
                    Logout
                </button>
            </li>
            <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors justify-end px-6 py-2 text-sm font-semibold">
                <a href="#" onClick={toggleMenu}>Account</a>
            </li>
        </ul>
        </nav>
    );
}

