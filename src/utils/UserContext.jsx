import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto
export const UserContext = createContext();
const APIURL = import.meta.env.VITE_BACK_API_URL;

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener el usuario almacenado al cargar la aplicación
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${APIURL}/auth`, { email, password });
            const { token, user} = response.data;

            // Almacenar el token y los datos del usuario
            localStorage.setItem('token', token);
            setUser(user);
            localStorage.setItem('loggedUser', JSON.stringify(user)); // Almacenar el usuario sin la contraseña
            setError(null); // Limpiar errores al iniciar sesión correctamente
        } catch (err) {
            setError(err.response?.data?.error || 'Error en el inicio de sesión');
            console.error("Error en el login:", err);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('token'); // También limpiar el token
    };

    return (
        <UserContext.Provider value={{ user, login, logout, error}}>
            {children}
        </UserContext.Provider>
    );
};
