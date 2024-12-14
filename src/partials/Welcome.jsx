import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../utils/UserContext";
import { IconCalendarMonth } from "@tabler/icons-react";
import moment from "moment"; // Time extension

export const Welcome = () => {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_BACK_API_URL;

  const currentDate = moment().format("DD-MM-YYYY");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige a SignIn si no hay token
      return;
    }
  }, [navigate, user, API_URL]);
  return (
    <div className="m-4 mt-2">
      <div className="flex justify-between">
        <div className="bg-sky-200 rounded-full w-fit px-2 text-xs flex items-center">
          <IconCalendarMonth stroke={1} />
          {currentDate}
        </div>
        <img src="../images/RTW.webp" alt="Workron" className="w-28 h-full sm:hidden" />
      </div>
      <div className="flex justify-between sm:hidden">
        {user ? (
          <div>
            <h2 className="my-4 max-sm:bg-white px-2 py-1 text-lg font-semibold sm:flex sm:justify-center">
              Hi, {user.name}
            </h2>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      <Link to="/time" className="sm:flex sm:justify-center">
        <p className="bg-indigo-600 text-white text-center mb-4 px-4 py-2 font-semibold sm:w-48">
          Start Shift
        </p>
      </Link>
    </div>
  );
};
