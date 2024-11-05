import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto
export const UserContext = createContext();
const API_URL = import.meta.env.VITE_BACK_API_URL;

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        // Obtener el usuario almacenado al cargar la aplicación
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth`, { email, password });
            const { token, user: userData } = response.data;

            // Almacenar el token y los datos del usuario
            localStorage.setItem('token', token);
            setUser(userData);
            localStorage.setItem('loggedUser', JSON.stringify(userData)); // Almacenar el usuario sin la contraseña
            setError(null); // Limpiar errores al iniciar sesión correctamente
        } catch (err) {
            setError(err.response?.data?.error || 'Error en el inicio de sesión');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('token'); // También limpiar el token
    };

    return (
        <UserContext.Provider value={{ user, login, logout, error }}>
            {children}
        </UserContext.Provider>
    );
};
