import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/UserContext";
import { CardPC } from "../components/CardPC";
import { CardMobile } from "../components/CardMobile";

export const Records = () => {
  const navigate = useNavigate();
  const [matchingRecords, setMatchingRecords] = useState([]); // Registros con email coincidente

  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_BACK_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige a SignIn si no hay token
      return;
    }

    // Cargar registros desde el archivo JSON y encontrar coincidencias de email
    const fetchTimeRecording = async () => {
      try {
        const response = await fetch(`${API_URL}/time`);
        const data = await response.json();

        // Filtrar los registros que coinciden con el email del usuario logueado
        if (user && user.email) { // Verifica que user y user.email estén definidos
        const recordsWithSameEmail = data.filter(
          (record) => record.email === user.email && record.open == true
        );
        setMatchingRecords(recordsWithSameEmail);
        } else {
          console.warn("User is not defined yet.");
        }
      } catch (error) {
        console.error("Error al cargar los registros:", error);
      }
    };

    fetchTimeRecording();
  }, [navigate, user, API_URL]);
  return (
    <div className="mb-10">
      {user ? (
        <div>
          <div className="max-sm:hidden">
            <CardPC />
          </div>
          {/* Clase para resoluciones de mobile */}
          <div className="sm:hidden">
            <CardMobile />
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};
