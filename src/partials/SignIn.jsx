import { useState, useContext } from 'react';
import { IconMail, IconKey } from '@tabler/icons-react';
/* import axios from 'axios'; */
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../utils/UserContext';

export const SignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    // Accedemos al contexto del usuario
    const { login } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(email, password); // Deja que UserContext maneje la autenticación
            navigate('/dashboard');       // Redirige al Dashboard después del login exitoso
        } catch (error) {
            setErrorMessage(error.message || 'Error en la autenticación');
        }

        /* const APIURL = import.meta.env.VITE_BACK_API_URL;

        const userData = {
            email,
            password
        };

        // Solicitud con axios
        try {
            const response = await axios.post(`${APIURL}/auth`, userData);

            const { token, user } = response.data;

            if (token) {
                login(user); // Guarda el usuario en el contexto
                localStorage.setItem('token', token); // Almacena el token
                navigate('/dashboard'); // Redirige al Dashboard
            } else {
                setErrorMessage('Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error de autenticación:', error);
            setErrorMessage('Error en la autenticación: ' + (error.response?.data?.error || error.message));
        } */
    };

  return (
    <>
        <form onSubmit={handleSubmit}>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div>
                <div className="flex -mx-3">
                    <div className="w-full px-3 mb-5">
                        <label htmlFor="email" className="text-xs font-semibold px-1">Email</label>
                        <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                <IconMail stroke={1} />
                            </div>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                placeholder="johnsmith@example.com"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="flex -mx-3">
                    <div className="w-full px-3 mb-12">
                        <label htmlFor="password" className="text-xs font-semibold px-1">Password</label>
                        <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                <IconKey stroke={1} />
                            </div>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                placeholder="************"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="flex -mx-3">
                    <div className="w-full px-3 mb-5">
                        <button className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </>
  )
}
