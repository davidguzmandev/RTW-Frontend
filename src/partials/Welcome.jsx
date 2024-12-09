import { useContext, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../utils/UserContext";

export const Welcome = () => {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_BACK_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige a SignIn si no hay token
      return;
    }
  }, [navigate, user, API_URL]);
  return (
    <div className="mb-4">
      {user ? (
        <div>
          <h2 className="mb-4 max-sm:bg-white px-2 py-1 text-lg font-semibold sm:flex sm:justify-center">
            Hi, {user.name}
          </h2>
          <Link to="/time" className="sm:flex sm:justify-center">
            <p className="bg-indigo-600 text-white text-center mb-4 px-4 py-2 font-semibold sm:w-48">
              Start Shift
            </p>
          </Link>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};
